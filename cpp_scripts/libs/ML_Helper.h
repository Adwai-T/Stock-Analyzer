#include <vector>

class Matrix {
private:
    std::vector<std::vector<double>> data;
    size_t rows, cols;

public:
    // Constructors
    Matrix(size_t rows, size_t cols);
    Matrix(const std::vector<std::vector<double>>& values);

    // Accessors
    double get(size_t row, size_t col) const;
    void set(size_t row, size_t col, double value);
    size_t numRows() const;
    size_t numCols() const;

    // Basic Operations
    Matrix operator+(const Matrix& other) const;
    Matrix operator-(const Matrix& other) const;
    Matrix operator*(double scalar) const;
    Matrix operator*(const Matrix& other) const;
    Matrix transpose() const;

    // Advanced Linear Algebra
    double determinant() const;
    Matrix inverse() const;
    double normFrobenius() const;

    // Debug / Utilities
    void print() const;
};