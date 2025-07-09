#include <iostream>
#include <vector>

#include "ML_Helper.h"

/**
 * y = w * x + b
 * x = input
 * w = weights
 * b = bias
 * y = prediction
 * 
 * for multiple inputs
 * y = w1*x1 + w2*x2 + ... + wn*xn + b OR
 * y = wᵗx + b
 * 
 * Given Dataset
 * X = [x₁, x₂, ..., xₙ]    ← input features
 * Y = [y₁, y₂, ..., yₙ]    ← target labels
 * 
 * Loss - Mean Squared Error
 * Lᵢ = (ŷᵢ - yᵢ)²
 * 
 * Cost function	(1/n) ∑ (ŷ - y)²	Average error across all examples
 * 
 * Gradient of w	(2/n) ∑ x (ŷ - y)	Slope adjustment
 * 
 * Gradient of b	(2/n) ∑ (ŷ - y)	Intercept adjustment
 * 
 * Update rule	w -= α * ∂J/∂w; b -= α * ∂J/∂b	Training step
 *  */
class LinearRegression{
private:
  Matrix y;
  Matrix x;
  Matrix w;
};