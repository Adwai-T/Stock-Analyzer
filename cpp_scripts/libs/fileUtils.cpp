#include "fileUtils.h"
#include <fstream>
#include <iostream>

std::vector<std::vector<std::string>> parseCSV(const std::string& filename, char delimiter) {
    std::vector<std::vector<std::string>> data;

    data = readFileLines(filename);
}

std::vector<std::string> readFileLines(const std::string &filename)
{
  std::vector<std::string> lines;
  std::ifstream infile(filename);

  if (!infile)
  {
    std::cerr << "Error: Could not open file for reading: " << filename << std::endl;
    return lines;
  }

  std::string line;
  while (std::getline(infile, line))
  {
    lines.push_back(line);
  }

  infile.close();
  return lines;
}

bool writeFileLines(const std::string &filename, const std::vector<std::string> &lines)
{
  std::ofstream outfile(filename);

  if (!outfile)
  {
    std::cerr << "Error: Could not open file for writing: " << filename << std::endl;
    return false;
  }

  for (const auto &line : lines)
  {
    outfile << line << "\n";
  }

  outfile.close();
  return true;
}