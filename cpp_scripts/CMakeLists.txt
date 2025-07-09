cmake_minimum_required(VERSION 3.10)
project(ML_Algorithms)

set(CMAKE_CXX_STANDARD 17)

# Add the 'libs' folder to the include path
include_directories(libs)

# Add executable and source files
add_executable(ML_Algorithms
    main.cpp
    libs/fileUtils.cpp
    libs/ML_Helper.cpp
    libs/Regression.cpp
)