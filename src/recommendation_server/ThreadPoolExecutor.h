#ifndef THREADPOOLEXECUTOR_H_H
#define THREADPOOLEXECUTOR_H_H

#include "IExecutor.h"
#include <vector>
#include <queue>
#include <thread>
#include <mutex>
#include <atomic>
#include <condition_variable>

class ThreadPoolExecutor : public IExecutor {
private:
  std::vector<std::thread> workers; // The worker threads
  std::queue<IRunnable*> tasks; // Queue of Ruunable tasks
  std::mutex queueMutex; // A mutex to control access to the queue
  std::condition_variable condition; // A condition variable to synchronize thread execution and avoid busy waiting
  std::atomic<bool> stop; // An atomic flag that signals the worker threads to stop execution, ensures that threads terminate after completing any remaining tasks when the pool is shutting down

  void workerFunction();

public:
  // Initialize the pool with numThreads threads
  ThreadPoolExecutor(size_t numThreads);

  // Execute a task
  void execute(IRunnable& task) override;

  // Wait for all task executions to finish
  void wait() override;

  ~ThreadPoolExecutor();
};

#endif