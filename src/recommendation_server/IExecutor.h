#ifndef IEXECUTOR_H
#define IEXECUTOR_H

# include "IRunnable.h"

class IExecutor {
public:
  
    // Execute the task
    virtual void execute(IRunnable& task) = 0;

    // Wait for all the task executions to finish
    virtual void wait() = 0;

    virtual ~IExecutor() = default;
};

#endif
