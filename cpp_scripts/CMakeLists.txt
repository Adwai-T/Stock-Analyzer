cmake_minimum_required(VERSION 3.10)
project(FileUtilsExample)

set(CMAKE_CXX_STANDARD 17)

# Add the 'libs' folder to the include path
include_directories(libs)

# Add executable and source files
add_executable(FileUtilsExample
    main.cpp
    libs/file_utils.cpp
)