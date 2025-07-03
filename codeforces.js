// api documentation: https://codeforces.com/apiHelp
const { getPassword, closeMongo, 
    postData, readData, deleteData } = require('./database.js');

async function addUserToLeaderboards(user) {
    const handle = user.handle;
    const anon = user.anon;
    try {
        await authenticateUserHandle(handle);
        await postData('leaderboardUsers', {handle: handle, anon: anon});
        await updateLeaderboards();
        return {success:true, };
    } catch(error) {
        return {success: false, error: error};
    }
    
}

async function updateLeaderboards() {
    try{
        const users = await getLeaderboardUsers();
        const currentChallenge = await getCurrentChallenge();

        const solvedProblems = await getUserProblems(users);
        const solvedChallenges = {};
        Object.keys(solvedProblems).forEach((user, solvedProblems) => {
            solvedChallenges[user] = solvedProblems.filter(problem => problem.type == currentChallenge);
        });

        await updateGlobalLeaderboard(solvedProblems);
        await updateChallengeLeaderboard(solvedChallenges);

        return {success: true};
    } catch(error) {
        return {success: false, error: error};
    }
}

async function getLeaderboardUsers() {
    throw new Error('function not implemented');
}

async function setChallengeLeaderboardTag(tag) {
    throw new Error('function not implemented');
}

async function getUserProblems(filterTag = null) {
    throw new Error('function not implemented');
}

async function updateGlobalLeaderboard() {
    throw new Error('function not implemented');
}

async function updateChallengeLeaderboard(){
    throw new Error('function not implemented');
}