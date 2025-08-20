package in.adwait.matrix;

import java.util.Arrays;
import java.util.concurrent.ThreadLocalRandom;

public class Matrix {
    private int rows;
    private int cols;
    private double[] data;

    public Matrix(int rows, int cols) {
        this.cols = cols;
        this.rows = rows;
        this.data = new double[rows * cols];
    }

    public Matrix(double[] data, int rows, int cols) {
        this.data = data;
        this.cols = cols;
        this.rows = rows;
    }

    public Matrix(double[][] data) {
        this.rows = data.length;
        this.cols = data[0].length;
        this.data = new double[this.rows * this.cols];

        int elementsAdded = 0;
        for(double[] row : data) {
            for(double col : row) {
                this.data[elementsAdded] = col;
                elementsAdded++;
            }
        }
    }

    public Matrix dot(Matrix other) {
        if(this.cols != other.rows) {
            throw new IllegalArgumentException("Matrices are not compatible for dot product.");
        }
        Matrix result = new Matrix(this.rows, other.cols);
        for (int i = 0; i < this.rows; i++){
            for (int j = 0; j < other.cols; j++) {
                for (int k = 0; k < this.cols; k++) {
                    result.set(i, j, result.get(i, j) + this.get(i, k) * other.get(k, j));
                }
            }
        }
        return result;
    }

    public Matrix transpose() {
        Matrix result = new Matrix(this.cols, this.rows);
        for(int i=0; i<this.rows; i++) {
            for(int j=0; j<this.cols; j++) {
                result.set(j, i, this.get(i, j));
            }
        }
        return result;
    }

    public Matrix scalarMultiply(double value) {
        Matrix result = new Matrix(this.rows, this.cols);
        for(int i=0; i< data.length; i++) {
            this.data[i] = this.data[i] * value;
        }
        return result;
    }

    public Matrix elementWiseMultiply(Matrix other) {
        if(this.rows != other.rows || this.cols != other.cols) {
            throw new IllegalArgumentException("Element Wise Multiplication between non compatible Matrices.");
        }
        Matrix result = new Matrix(this.rows, this.cols);
        for(int i=0; i<this.data.length; i++) {
            result.data[i] = this.data[i] * other.data[i];
        }

        return result;
    }

    public Matrix add(Matrix other) {
        if(this.rows != other.rows || this.cols != other.cols) {
            throw new IllegalArgumentException("Element Wise Addition between non compatible Matrices.");
        }
        Matrix result = new Matrix(this.rows, this.cols);
        for(int i=0; i<this.data.length; i++) {
            result.data[i] = this.data[i] + other.data[i];
        }
        return result;
    }

    public double get(int row, int col) {
        return data[row*this.cols + col];
    }

    public void set(int row, int col, double value) {
        this.data[row*this.cols + col] = value;
    }

    public double[][] to2DArray() {
        double[][] result = new double[rows][cols];
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                result[i][j] = this.get(i, j);
            }
        }
        return result;
    }

    public void fill(double value) {
        Arrays.fill(data, value);
    }

    public Matrix deepCopy() {
        Matrix copy = new Matrix(rows, cols);
        System.arraycopy(this.data, 0, copy.data, 0, data.length);
        return copy;
    }

    public void randomFill(double min, double max) {
        for(int row=0; row < this.rows; row++) {
            for(int col=0; col < this.cols; col++) {
                set(row, col, ThreadLocalRandom.current().nextDouble(min, max));
            }
        }
    }

    public void print() {
        System.out.println("{");
        for(int i = 0; i < this.rows; i++) {
            System.out.print("[  ");
            for(int j = 0; j < this.cols; j++) {
                System.out.print(data[i*this.cols + j] + "  ");
            }
            System.out.println(']');
        }
        System.out.println("}");
    }
}