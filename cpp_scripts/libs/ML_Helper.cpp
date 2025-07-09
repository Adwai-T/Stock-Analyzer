/**
 * Matrix
 */
#include <vector>
#include <iostream>

#include "ML_Helper.h"

// g++ cpp_scripts\libs\ML_Helper.cpp

    Matrix::Matrix(size_t rows, size_t cols, bool isIdentity, bool isOnesMatrix)
    {
        this->rows = rows;
        this->cols = cols;
        //-- Initialized with 0.0 by default
        this->data = std::vector<std::vector<double>>(rows, std::vector<double>(cols));
        if (isIdentity && rows == cols)
        {
            for (size_t i = 0; i < rows; i++)
            {
                this->data[i][i] = 1;
            }
        }

        if (isOnesMatrix)
        {
            for (size_t i = 0; i < rows; i++)
            {
                for (size_t j = 0; j < cols; j++)
                {
                    this->data[i][j] = 1;
                }
            }
        }
    }
    Matrix::Matrix(const std::vector<std::vector<double>> &values)
    {
        this->data = values;
        this->rows = data.empty() ? 0 : data.size();
        this->cols = (data.empty() || data[0].empty()) ? 0 : data[0].size();
    }

    size_t Matrix::getRows() const
    {
        return this->rows;
    }
    size_t Matrix::getCols() const
    {
        return this->cols;
    }

    Matrix Matrix::getTranspose() const
    {
        Matrix transpose(this->cols, this->rows); // rows become cols
        for (size_t i = 0; i < this->rows; i++)
        {
            for (size_t j = 0; j < this->cols; j++)
            {
                transpose.data[j][i] = this->data[i][j];
            }
        }
        return transpose;
    }

    Matrix Matrix::getProduct(Matrix mat) const
    {
        if (this->cols != mat.rows)
        {
            throw std::runtime_error("Matrix dimensions are incompatible for multiplication.");
        }
        Matrix product(this->cols, mat.rows);
        for (size_t i = 0; i < this->rows; i++)
        {
            for (size_t j = 0; j < this->cols; j++)
            {
                double thisMatrixRow = this->data[i][j]; // Load once per inner loop
                for (size_t k = 0; k < mat.cols; k++)
                {
                    product.data[i][j] += thisMatrixRow * mat.data[j][k];
                }
            }
        }
        return product;
    }

    // Debug / Utilities
    void Matrix::print() const
    {
        std::cout << "Matrix (" << rows << "x" << cols << "):\n";
        for (int i = 0; i < rows; ++i)
        {
            for (int j = 0; j < cols; ++j)
            {
                std::cout << data[i][j] << "\t";
            }
            std::cout << std::endl;
        }
    };