variables = {}

def run_line(line):
    parts = line.split()
    if not parts:
        return
    if parts[0] == 'print':
        if parts[1] in variables:
            print(parts[1])
            print(variables[parts[1]])
        else:
            print(" ".join(parts[1]))

    elif parts[0] == 'set':
        var_name = parts[1]
        value = int(parts[3])
        variables[var_name] = value
    
    elif parts[0] == 'add':
        var_name = parts[1]
        value = int(parts[2])
        variables[var_name] += value
    print(variables)

def run_program(code):
    lines = code.split("\n")
    print(f"LINES {lines}")
    for line in lines:
        print(f"CURRENT {line}")
        run_line(line)
program = """
set x = 5
add x 3
print x
""" 
import uuid 

id = str(uuid.uuid4())

print(id)
print(id[:8])