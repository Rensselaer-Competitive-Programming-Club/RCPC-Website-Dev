async function getProfiles(users) {
    const allUserHandlesSemicolonSeparated = (users.map(user => user.handle)).join(';');
    return await fetch(`https://codeforces.com/api/user.info?handles=${allUserHandlesSemicolonSeparated}&checkHistoricHandles=false`);
}

async function getProblems(profile, filter) {
    return await fetch(`https://codeforces.com/api/user.status?handle=${profile.handle}&from=1`);
}

async function getChallengeScore()

function calculateChallengeScore(problems) {

    let score = 0;
    problems.forEach(element => {
        const rating = problems.rating;
        const attempts = problems.submissionCount;
        const elapsedTime = problems.submissionTime;
        
        const averageTimeConstant = 45;
        const timePenaltyFactor = 3;
        const timePenalty = timePenaltyFactor * (elapsedTime - averageTimeConstant);
        
        const attemptPenaltyFactor = 50;
        const attemptPenalty = attempts * attemptPenaltyFactor;
        
        const problemDifficultyBonus = rating ** 1.002;

        const challengeScore = rating - timePenalty - attemptPenalty + problemDifficultyBonus;
        score += challengeScore;
    });
    return score;
}