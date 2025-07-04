import sys
import json
import requests
import time

def getOKSubmissions(problemID, handles):
    submissions = dict()
    for handle in handles:
        url = f"https://codeforces.com/api/user.status?handle={handle}&count={100}"
        response = requests.get(url)
        data = response.json()
        
        if data['status'] != 'OK':
            raise Exception(f"API Error: {data.get('comment', 'Unknown error')}")
        
        for submission in data["result"]:
            id = str(submission["problem"]["contestId"]) + str(submission["problem"]["index"])
            # check to see if the submission matches the problemID
            if(id == problemID):
                # see what time they completed the problem at
                completionTime = submission["creationTimeSeconds"] + submission["timeConsumedMillis"] / 1000
                if handle not in submissions or submissions[handle] > completionTime:
                    submissions[handle] = completionTime

        # need to wait 2 seconds in between codeforces api calls
        time.sleep(2)
    order = ""
    for key, value in sorted(submissions.items(), key=lambda item: item[1]):
        order += key + " "
    print(order)

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: script.py <functionName> <jsonArgs>", file=sys.stderr)
        sys.exit(1)

    funcName = sys.argv[1]
    try:
        funcArgs = sys.argv[2:]  # Get all arguments after function name
        for i in range(len(funcArgs)):
            # Parse the argument if it's a stringified JSON object
            try:
                funcArgs[i] = json.loads(funcArgs[i])
            except json.JSONDecodeError:
                pass  # If it's not valid JSON, leave it as a string
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}", file=sys.stderr)
        sys.exit(1)
    # Check if the function exists in the globals
    if funcName in globals():
        try:
            result = globals()[funcName](*funcArgs)  # Pass the unpacked arguments
        except TypeError as e:
            print(f"Function call error: {e}", file=sys.stderr)
            sys.exit(1)
    else:
        print(f"Function '{funcName}' not found.", file=sys.stderr)
        sys.exit(1)
