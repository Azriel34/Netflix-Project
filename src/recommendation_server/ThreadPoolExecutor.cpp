# include "ThreadPoolExecutor.h"

using namespace std;

ThreadPoolExecutor::ThreadPoolExecutor(size_t numThreads) : stop(false){
  // create numThreads working threads and add them to the workers queue
  for (size_t i = 0; i < numThreads; ++i) {
    workers.emplace_back([this]() { workerFunction(); });
  }
}


void ThreadPoolExecutor::workerFunction() { 
  while (true) {
    IRunnable* task;

    // critical section
    {
      // Protect access to the tasks queue
      unique_lock<mutex> lock(queueMutex);
      // Wait untill the tasks queue is not empty or the stop flag is on
      condition.wait(lock, [this]() { return stop || !tasks.empty(); });

      // Stop flag is ture and there are no more tasks to execute, finish execution
      if (stop && tasks.empty())
          return;
      
      // Get a task from the queue
      task = tasks.front();
      tasks.pop();
    }

    // Run the task outside the critical section
    task -> run();


    // Notify after finishing a task
    {
      lock_guard<mutex> lock(queueMutex);
      if (tasks.empty()) {
          condition.notify_all(); // Notify waiting threads that the queue is empty, usefull for the waiting method
      }
    }
  }
}

void ThreadPoolExecutor::execute(IRunnable& task){ 
  // critical section
  {
      unique_lock<mutex> lock(queueMutex);
      tasks.push(&task);
  }
  // notify one worker thread that a task is available (wake him up)
  condition.notify_one();
}

void ThreadPoolExecutor::wait(){
  // Wait until the tasks queue is empty
  unique_lock<mutex> lock(queueMutex);
  // Note: condition.wait(...) releases the lock while waiting
  condition.wait(lock, [this]() { return tasks.empty(); });
}

ThreadPoolExecutor::~ThreadPoolExecutor() {
  // critical section
  {
    unique_lock<mutex> lock(queueMutex);
    // Singal all the threads to stop
    stop = true;
  }

  // notify all the worker threads to continue
  condition.notify_all();

  // join all the worker threads
  for (thread& worker : workers) {
    if (worker.joinable()) {
      worker.join();
    }
  }
}