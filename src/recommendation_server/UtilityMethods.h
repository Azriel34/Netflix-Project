// UtilityMethods.h
#ifndef UTILITYMETHODS_H
#define UTILITYMETHODS_H

#include <string>
#include <cctype>
#include <algorithm>

class UtilityMethods {
public:
    // Check if a string contains exactly two numbers
    static bool containsTwoNumbers(const std::string& str);

    // Check if a string contains no letters
    static bool containsNoLetters(std::string number);
    
    // Trim whitespace from both ends of a string
    static std::string trim(const std::string& str);

    // Convert a string to lowercase
    static std::string toLowerCase(const std::string& str);

    //check for only spaces or ''
    static bool onlySpaces(const std::string& input);

    // Check if a string is a valid integer
    static bool isInteger(const std::string& str);
};

#endif