#include "StatusCodeCollection.h"

std::string StatusCodeCollection::get200() {
    return "200 OK";
} 

std::string StatusCodeCollection::get201() {
    return "201 Created";
}

std::string StatusCodeCollection::get204() {
    return "204 No Content";
}

std::string StatusCodeCollection::get400() {
    return "400 Bad Request";
}

std::string StatusCodeCollection::get404() {
    return "404 Not Found";
}
