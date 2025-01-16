# include "SeparateThreadExecutor.h"

using namespace std;

SeparateThreadExecutor:: SeparateThreadExecutor(){};

void SeparateThreadExecutor::execute(IRunnable& task){
  // Create a thread that runs the run() method of the task object while adding the thread object to the threads vector

  threads.emplace_back(thread([&task]() {
    task.run();
  }));
}

void SeparateThreadExecutor::wait(){
  // Wait for all the created thread to finish their executions
  for (auto& thread : threads) {
        // Check if the thread is still running or finished but has not been joined yet.
        if (thread.joinable()) {
            thread.join();
        }
  }
  // Clear the vector after joining all of the threads
  threads.clear();
}