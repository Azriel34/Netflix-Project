// UtilityMethods.cpp
#include "UtilityMethods.h"

bool UtilityMethods::containsTwoNumbers(const std::string& str) {
    int count = 0;
    for (char c : str) {
        if (isdigit(c)) {
            ++count;
            if (count > 2) {
                return false;
            }
        }
    }
    return count == 2;
}

bool UtilityMethods::onlySpaces(const std::string& input){
    for (char ch : input) {
        // Check if the character is a whitespace but not a space
        if (std::isspace(ch) && ch != ' ') {
            return false;
        }
    }
    return true;
}

bool UtilityMethods::containsNoLetters(std::string number){
    if (number.empty()) {
        return false;
    }
    size_t start = 0;
    // Iterate through each character to check for digits
    for (size_t i = start; i < number.size(); ++i) {
        if (!isdigit(number[i])) {
            return false;  // If it's not a digit, return false
        }
    }
    return true;
}
std::string UtilityMethods::toLowerCase(const std::string& str) {
    std::string result = str;
    std::transform(result.begin(), result.end(), result.begin(), [](unsigned char c) {
        return std::tolower(c);
    });
    return result;
}

bool UtilityMethods::isInteger(const std::string& str) {
    if (str.empty()) {
        return false;
    }
    size_t i = 0;
    if (str[0] == '-' || str[0] == '+') {
        i = 1;
    }
    return std::all_of(str.begin() + i, str.end(), [](char c) {
        return isdigit(c);
    });
}