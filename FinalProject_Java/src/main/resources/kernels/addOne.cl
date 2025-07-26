__kernel void addOne(__global float* input) {
    int i = get_global_id(0);
    input[i] = input[i] + 1.0f;
}