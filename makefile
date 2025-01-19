# Compiler
CXX := g++
# Compiler flags
CXXFLAGS := -g
# Source directory
SRC_DIR := src/recommendation_server
# Output executable
TARGET := program
# Object files
OBJ_FILES := $(patsubst $(SRC_DIR)/%.cpp, %.o, $(wildcard $(SRC_DIR)/*.cpp))

# Default target
all: $(TARGET)

# Rule to link object files into the final executable
$(TARGET): $(OBJ_FILES)
	$(CXX) $(CXXFLAGS) -o $@ $^

# Rule to compile .cpp files into .o files
%.o: $(SRC_DIR)/%.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

# Clean function to remove generated files
clean:
	rm -f $(TARGET) *.o

# Phony targets
.PHONY: all clean
