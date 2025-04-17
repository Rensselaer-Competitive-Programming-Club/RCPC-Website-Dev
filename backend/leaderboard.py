import sys



if __name__ == '__main__':
    funcName = sys.argv[1]

    # check if provided function name is an existing function
    if funcName in globals():
        result = globals()[funcName]()
        print(result)
    else:
        print(f"Function '{funcName}' not found.", file=sys.stderr)
        exit(1)
