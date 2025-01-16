#ifndef SEPARATETHREADEXECUTOR_H
#define SEPARATETHREADEXECUTOR_H

#include "IExecutor.h"
#include <thread>
#include <vector>

class SeparateThreadExecutor : public IExecutor {
private:
    // A vector of the created threads for future joining in the wait method
    std::vector<std::thread> threads; 
public:
  SeparateThreadExecutor();

  // Execute a task
  void execute(IRunnable& task) override;

  // Wait for all task executions to finish
  void wait() override;
    
};

#endif