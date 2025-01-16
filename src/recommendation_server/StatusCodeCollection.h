#ifndef STATUS_CODE_COLLECTION_H
#define STATUS_CODE_COLLECTION_H

#include <string>

class StatusCodeCollection {
public:
    // Static methods to get descriptions of status codes
    static std::string get200();
    static std::string get201();
    static std::string get204();
    static std::string get400();
    static std::string get404();
};

#endif
