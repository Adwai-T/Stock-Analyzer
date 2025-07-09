#include <iostream>
#include <vector>
#include "ML_Helper.h"
#include "fileUtils.h"

// -- g++ main.cpp

int main() {
  std::cout << "Start" << std::endl;
    // Create a Matrix object with 3 rows and 4 columns
    std::vector<std::vector<double>> vec1;
    vec1 = {
      {1, 2, 3},
      {3, 4, 5},
      {4, 5, 6}
    };

    std::vector<std::vector<double>> vec2;
    vec2 = {
      {2, 3},
      {4, 5},
      {7, 8}
    };

    Matrix mat1(vec1);
    Matrix mat2(vec2);

    // Print the matrix to verify its contents
    mat1.print();
    mat2.print();

    Matrix mat = mat1.getTranspose();
    mat1.print();

    Matrix result = mat1.getProduct(mat2);
    result.print();

  std::cout << "End" << std::endl;
  return 0;
}

