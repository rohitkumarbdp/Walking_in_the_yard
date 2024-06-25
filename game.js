let vectors = [];
let currentX, currentY;
let centerX, centerY;
let yardRadius = 320; // 20 meters scaled
let moveIndex = 0;
let userPath = [];
let solutionPath = [];
let generatedVectors = [];
let prisonerImage;

function preload() {
    prisonerImage = loadImage('prisoner.jpg'); // Load a prisoner image
}

function setup() {
    let canvas = createCanvas(900, 700);
    canvas.parent('p5Canvas');
    centerX = width / 2;
    centerY = height / 2;
    currentX = centerX;
    currentY = centerY;
    drawYard();
    noLoop(); 
}

function drawYard() {
    // background(240);
    background("#007E1C")
    drawGrid();
    stroke('white');
    strokeWeight(5);
    noFill();
    ellipse(centerX, centerY, yardRadius * 2);
    drawDottedCircle(centerX, centerY, yardRadius);

    // Draw the prisoner at the current position
    image(prisonerImage, currentX - 10, currentY - 10, 20, 20);

    // Draw a small filled circle at the center
    fill('red');
    noStroke();
    // strokeWeight(5)
    ellipse(centerX, centerY, 30);

    drawUserPath();
}

function drawGrid() {
    stroke('#888');
    strokeWeight(2);
    for (let x = 0; x <= width; x += 40) {
        line(x, 0, x, height);
    }
    for (let y = 0; y <= height; y += 40) {
        line(0, y, width, y);
    }
}

function drawDottedCircle(x, y, radius) {
    let numDots = 100;
    let angleIncrement = TWO_PI / numDots;
    
    stroke('black');
    strokeWeight(4);
    for (let i = 0; i < numDots; i++) {
        let angle = i * angleIncrement;
        let dotX = x + (radius / 2) * cos(angle);
        let dotY = y + (radius / 2) * sin(angle);
        point(dotX, dotY);
    }
}

function drawUserPath() {
    stroke('white');
    strokeWeight(4);
    let arrowSize = 10;

    let x = centerX;
    let y = centerY;
    for (let vector of userPath) {
        let newX = x + vector.x;
        let newY = y + vector.y;

        drawArrow(createVector(x, y), createVector(newX, newY), arrowSize);

        x = newX;
        y = newY;
    }
}


function drawArrow(base, vec, arrowSize) {
    let angle = atan2(vec.y - base.y, vec.x - base.x); // Calculate the angle of the vector
    push(); // Save the current drawing state
    translate(base.x, base.y); // Move to the base of the arrow
    line(0, 0, vec.x - base.x, vec.y - base.y); // Draw the main line of the arrow
    
    // Move to the end of the main line
    translate(vec.x - base.x, vec.y - base.y);
    rotate(angle); // Rotate to the direction of the vector
    
    // Draw the two lines of the arrowhead
    line(0, 0, -arrowSize, arrowSize / 2);
    line(0, 0, -arrowSize, -arrowSize / 2);
    pop(); // Restore the previous drawing state
}





function checkIfVectorExceedsHalfOfRadius(vectors){
    for (let i = 0; i < vectors.length; i++){
        if (abs(vectors[i].x) > yardRadius/2 || abs(vectors[i].y) > yardRadius/2){
            return true;
        }
    }
    return false;

}

function generateVectors(n) {
    vectors = [];
    let halfRadius = yardRadius / 2;
    
    // Step 1: Generate n vectors within the allowable range
    for (let i = 0; i < n; i++) {
        let x = random(-halfRadius, halfRadius);
        let y = random(-halfRadius, halfRadius);
        vectors.push({ x, y });
    }

    // Step 2: Calculate the sum of all generated vectors
    let sumX = vectors.reduce((acc, v) => acc + v.x, 0);
    let sumY = vectors.reduce((acc, v) => acc + v.y, 0);

    // Step 3: Determine the adjustment needed to make the sum zero
    let adjustmentX = -sumX / n;
    let adjustmentY = -sumY / n;

    // Step 4: Add the adjustment to all n vectors
    vectors = vectors.map(v => ({
        x: v.x + adjustmentX,
        y: v.y + adjustmentY
    }));

    if (checkIfVectorExceedsHalfOfRadius(vectors)){
        generateVectors(n);
    }

    generatedVectors = [...vectors];
    userPath = [];
    currentX = centerX;
    currentY = centerY;
    moveIndex = 0;
    drawYard();
    displayVectors();
}


function displayVectors() {
    let vectorList = document.getElementById('vectorList');
    if (!vectorList) {
        vectorList = document.createElement('div');
        vectorList.id = 'vectorList';
        vectorList.style.marginTop = '20px';
        document.querySelector('.controls').appendChild(vectorList);
    }
    vectorList.innerHTML = '';
    vectors.forEach((v, index) => {
        let button = document.createElement('button');
        button.textContent = `Vector ${index + 1}: (${v.x.toFixed(2)}, ${v.y.toFixed(2)})`;
        button.addEventListener('click', () => movePrisoner(index));
        vectorList.appendChild(button);
    });
}

function movePrisoner(index) {
    let vector = vectors[index];
    let newX = currentX + vector.x;
    let newY = currentY + vector.y;

    if (dist(centerX, centerY, newX, newY) <= yardRadius) {
        currentX = newX;
        currentY = newY;
        userPath.push(vector);
        drawYard();
        vectors.splice(index, 1);
        displayVectors();
        if (vectors.length === 0) {
            if (dist(centerX, centerY, currentX, currentY) < 0.2) {
                alert('You win!');
            } else {
                alert('You lose! The prisoner did not return to the center.');
                showSolution();
            }
        }
    } else {
        alert('You lose! The prisoner crossed the boundary.');
        showSolution();
    }
}


///////////////////////////////////////////////////////////////////////////





function findSolutionPath() {
    // This function implements a simple backtracking algorithm to find a solution path
    solutionPath = [];
    let path = [];
    function backtrack(x, y, remainingVectors) {
        if (remainingVectors.length === 0) {
            if (x === centerX && y === centerY) {
                solutionPath = path.slice();
                return true;
            } else {
                return false;
            }
        }
        for (let i = 0; i < remainingVectors.length; i++) {
            let vector = remainingVectors[i];
            let newX = x + vector.x;
            let newY = y + vector.y;
            if (dist(centerX, centerY, newX, newY) <= yardRadius) {
                path.push(vector);
                if (backtrack(newX, newY, remainingVectors.slice(0, i).concat(remainingVectors.slice(i + 1)))) {
                    return true;
                }
                path.pop();
            }
        }
        return false;
    }
    backtrack(centerX, centerY, generatedVectors.slice());
}





let animationIndex = 0;
let animationProgress = 0;
let animationSpeed = 0.03; // Adjust this value to control the speed of the animation

function showSolution() {
    findSolutionPath();
    if (solutionPath.length > 0) {
        animationIndex = 0;
        animationProgress = 0;
        currentX = centerX;
        currentY = centerY;
        
        loop();
    } else {
        alert('No solution found.');
    }
}

function drawSolutionStep() {
    let arrowSize = 8;

    if (animationIndex < solutionPath.length) {
        let vector = solutionPath[animationIndex];
        let targetX = currentX + vector.x;
        let targetY = currentY + vector.y;
        
        // Calculate the current position of the animation based on progress
        let animX = lerp(currentX, targetX, animationProgress);
        let animY = lerp(currentY, targetY, animationProgress);

        drawArrow(createVector(currentX, currentY), createVector(animX, animY), arrowSize);

        // Draw the index near the arrow
        fill('red');
        noStroke();
        textSize(18);
        textAlign(CENTER, CENTER);
        text(animationIndex + 1, (currentX + animX) / 2, (currentY + animY) / 2);

        // Update the progress of the current arrow
        animationProgress += animationSpeed;
        
        // If the arrow is fully drawn, move to the next arrow
        if (animationProgress >= 1) {
            currentX = targetX;
            currentY = targetY;
            animationProgress = 0;
            animationIndex++;
        }
    } else {
        // Stop the animation when all arrows are drawn
        noLoop();
        alert('Solution path shown in blue.');
    }
}

function draw() {
    drawYard();
    if (solutionPath.length > 0) {
        stroke('red');
        strokeWeight(5);
        noFill();
        beginShape();
        vertex(centerX, centerY);
        let tempX = centerX;
        let tempY = centerY;
        for (let i = 0; i < animationIndex; i++) {
            let vector = solutionPath[i];
            let newX = tempX + vector.x;
            let newY = tempY + vector.y;
            vertex(newX, newY);
            tempX = newX;
            tempY = newY;
        }
        endShape();
        drawSolutionStep();
    }
}







/////////////////////////////////////////////
document.getElementById('playButton').addEventListener('click', () => {
    let n = parseInt(document.getElementById('vectorCount').value);
    if (n > 0) {
        generateVectors(n);
    } else {
        alert('Please enter a valid number of vectors.');
    }
});

document.getElementById('solutionButton').addEventListener('click', showSolution);

setup();


   
