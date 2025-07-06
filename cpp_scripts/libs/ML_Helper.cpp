/**
 * Matrix
 */
#include <vector>
#include <iostream>

// g++ cpp_scripts\libs\ML_Helper.cpp

class Matrix
{
private:
    //- data[i][j] would be i=row j=column
    std::vector<std::vector<double>> data;
    //- used for representing size of an object, number of elements
    size_t rows, cols;

public:
    // Constructors
    Matrix(size_t rows, size_t cols, bool isIdentity = false, bool isOnesMatrix = false)
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
    Matrix(const std::vector<std::vector<double>> &values)
    {
        this->data = data;
        this->rows = data.empty() ? 0 : data.size();
        this->cols = (data.empty() || data[0].empty()) ? 0 : data[0].size();
    }

    size_t getRows()
    {
        return this->rows;
    }
    size_t getCols()
    {
        return this->cols;
    }

    Matrix getTranspose()
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

    Matrix getProduct(Matrix mat)
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
    void print() const
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
};

int main()
{
    // Create a Matrix object with 3 rows and 4 columns
    std::vector<std::vector<double>> vec1;
    vec1[0] = std::vector<double>{1, 2, 3};
    vec1[1] = std::vector<double>{3, 4, 5};
    vec1[2] = std::vector<double>{4, 5, 6};

    std::vector<std::vector<double>> vec2;
    vec2[0] = std::vector<double>{2, 3};
    vec2[1] = std::vector<double>{4, 5};
    vec2[2] = std::vector<double>{7, 8};
    Matrix mat1(vec1);
    Matrix mat2(vec2);

    // Print the matrix to verify its contents
    mat1.print();
    mat2.print();

    Matrix mat = mat1.getTranspose();
    mat1.print();

    Matrix result = mat1.getProduct(mat2);
    result.print();

    return 0;
}