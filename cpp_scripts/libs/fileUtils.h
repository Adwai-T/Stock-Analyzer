#ifndef FILE_UTILS_H
#define FILE_UTILS_H

#include <string>
#include <vector>

// Reads all lines from a file and returns them as a vector of strings
std::vector<std::string> readFileLines(const std::string& filename);

// Writes a vector of strings to a file (each element on a new line)
bool writeFileLines(const std::string& filename, const std::vector<std::string>& lines);

std::vector<std::vector<std::string>> parseCSV(const std::string& filename, char delimiter = ',');

#endif