import sys, json

def test(jsonData):
    print("testing testing 123")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: script.py <functionName> [args...]", file=sys.stderr)
        sys.exit(1)

    funcName = sys.argv[1]
    
    # try to get args from command line
    try:
        funcArgs = json.loads(' '.join(sys.argv[2:])) # turn string back into a json
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}", file=sys.stderr)
        sys.exit(1)

    # check if provided function name is an existing function
    if funcName in globals():
        try:
            result = globals()[funcName](*funcArgs)
        except TypeError as e:
            print(f"Function call error: {e}", file=sys.stderr)
            sys.exit(1)
    else:
        print(f"Function '{funcName}' not found.", file=sys.stderr)
        sys.exit(1)
