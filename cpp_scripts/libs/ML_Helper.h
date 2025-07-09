#ifndef ML_HELPER_H
#define ML_HELPER_H

#include <vector>

class Matrix {
private:
    std::vector<std::vector<double>> data;
    size_t rows, cols;

public:
    Matrix(size_t rows, size_t cols, bool isIdentity = false, bool isOnesMatrix = false);
    Matrix(const std::vector<std::vector<double>>& values);

    size_t getRows() const;
    size_t getCols() const;

    Matrix getTranspose() const;
    Matrix getProduct(Matrix mat) const;

    void print() const;
};

#endif