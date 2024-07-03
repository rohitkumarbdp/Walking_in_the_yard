let vectors = [];
let generatedVectors = [];
let angleX = 0;
let angleY = 0;
let canvasHight = 750;
let canvasLength = 800;
let isMousePressed = false;
let myFont; // Declare variable for the font
let yardRadius = 300;
let solutionPath = [];

let currentX, currentY, currentZ;
let userPath = [];
isAnimating = false;

function preload() {
  myFont = loadFont("../static/Roboto-Regular.ttf"); // Replace with your actual font file path
}

function setup() {
  //   createCanvas(windowWidth, windowHeight, WEBGL);
  const canvas = createCanvas(canvasLength, canvasHight, WEBGL);
  canvas.parent("canvas-container");
  textFont(myFont);
  centerX = 0;
  centerY = 0;
  centerZ = 0;
  currentX = centerX;
  currentY = centerY;
  currentZ = centerZ;

  drawYard();
  // noLoop();
}

function draw() {
  //   background("#007E1C");
  background("#040340");
  rotateX(-angleX);
  rotateY(angleY);

  drawYard();
  // if (solutionPath.length > 0) {   /// working
  //   drawSolutionStep();
  // }
  if (solutionPath.length > 0) {
    noFill();
    stroke("#F300FF");
    strokeWeight(5);
    beginShape();
    // vertex(centerX, centerY, centerZ);
    let tempX = centerX;
    let tempY = centerY;
    let tempZ = centerZ;
    for (let i = 0; i < animationIndex; i++) {
      let vector = solutionPath[i];
      let newX = tempX + vector.x;
      let newY = tempY + vector.y;
      let newZ = tempZ + vector.z;
      line(tempX, tempY, tempZ, newX, newY, newZ);
      // Draw the small sphere at the end of each vector
      push();
      translate(newX, newY, newZ);
      stroke("#FDD4FF");
      sphere(4); // Adjust the sphere size if needed
      pop();
      //   vertex(newX, newY, newZ);
      tempX = newX;
      tempY = newY;
      tempZ = newZ;
    }
    endShape();
    if (isAnimating) {
      drawSolutionStep();
    }
    // drawSolutionStep();
  }

  //   if (animationIndex < solutionPath.length) {
  //     drawSolutionStep();
  //   }
}

function drawYard() {
  drawAxes();

  noFill();
  stroke("#1E707A");
  strokeWeight(1); // 2 pixels wide
  sphere(yardRadius); // parameter is radius

  // Draw a small filled circle at the center
  fill("#08FF00");
  noStroke();
  sphere(12);
  drawUserPath();

  if (isMousePressed) {
    angleX = map(mouseY, 0, height, -PI, PI);
    angleY = map(mouseX, 0, width, -PI, PI);
  }
}

function drawAxes() {
  strokeWeight(2);

  // X-axis (red)
  stroke(255, 0, 0); // Set stroke color to red
  textSize(16);
  strokeWeight(2);
  line(-500, 0, 0, 500, 0, 0); // Draw a line for the X-axis from (-500, 0, 0) to (500, 0, 0)
  for (let i = -500; i <= 500; i += 50) {
    push();
    translate(i, 0, 0);
    fill(255, 0, 0);
    noStroke();
    text(i, 5, 0);
    pop();
  }

  // Y-axis (white)
  stroke(255);
  textSize(16);
  strokeWeight(2);
  line(0, -500, 0, 0, 500, 0);
  for (let i = -500; i <= 500; i += 50) {
    push();
    translate(0, i, 0);
    fill(255);
    noStroke();
    text(i, 5, 0);
    pop();
  }

  // Z-axis (blue)
  stroke("yellow");
  textSize(16);
  strokeWeight(2);
  line(0, 0, -500, 0, 0, 500);
  for (let i = -500; i <= 500; i += 50) {
    push();
    translate(0, 0, i);
    fill("yellow");
    noStroke();
    text(i, 5, 0);
    pop();
  }

  // Labels
  push();
  fill(255);
  // noStroke();
  stroke(0);
  strokeWeight(1);

  fill(255, 0, 0);
  textSize(20);
  text("X-axis", 300, -30, 0);
  text("X-axis", -300, -30, 0);

  fill(255);
  textSize(20);
  text("Y-axis", 40, 270, 0);
  text("Y-axis", 40, -270, 0);

  fill("yellow");
  textSize(20);
  translate(0, 0, 250);
  text("Z-axis", 0, -20, 250);
  pop();
}

function mousePressed() {
  // Check if the mouse is inside the canvas
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    isMousePressed = true;
  }
}

function mouseReleased() {
  isMousePressed = false;
}

function windowResized() {
  resizeCanvas(canvasLength, canvasHight);
}

function checkIfVectorExceedsThirdOfRadius(vectors) {
  for (let i = 0; i < vectors.length; i++) {
    if (
      Math.abs(vectors[i].x) > yardRadius / 3 ||
      Math.abs(vectors[i].y) > yardRadius / 3 ||
      Math.abs(vectors[i].z) > yardRadius / 3
    ) {
      return true;
    }
  }
  return false;
}
// generate n vectors which sums to zero and are of length atmost yardradius/3

function generateVectors(n) {
  vectors = [];
  let OnethirdRadius = yardRadius / 3;

  // Step 1: Generate n vectors within the allowable range
  for (let i = 0; i < n; i++) {
    let theta = Math.random(0, Math.TWO_PI);
    let phi = Math.random(0, Math.PI); // Phi angle for 3D

    let r = OnethirdRadius * pow(Math.random(0.8, 0.99), 0.5);

    let x = r * Math.cos(theta) * Math.sin(phi);
    let y = r * Math.sin(theta) * Math.sin(phi);
    let z = r * Math.cos(phi);

    vectors.push({ x, y, z });
  }

  // Step 2: Calculate the sum of all generated vectors
  let sumX = vectors.reduce((acc, v) => acc + v.x, 0);
  let sumY = vectors.reduce((acc, v) => acc + v.y, 0);
  let sumZ = vectors.reduce((acc, v) => acc + v.z, 0);

  // Step 3: Determine the adjustment needed to make the sum zero
  let adjustmentX = -sumX / n;
  let adjustmentY = -sumY / n;
  let adjustmentZ = -sumZ / n;

  // Step 4: Add the adjustment to all n vectors
  vectors = vectors.map((v) => ({
    x: v.x + adjustmentX,
    y: v.y + adjustmentY,
    z: v.z + adjustmentZ,
  }));

  // Step 5: Check if any vector exceeds the allowable range
  if (checkIfVectorExceedsThirdOfRadius(vectors)) {
    generateVectors(n); // Regenerate vectors if any exceed the range
  }

  generatedVectors = [...vectors];
  userPath = [];
  currentX = centerX;
  currentY = centerY;
  currentZ = centerZ;
  drawYard();
  displayVectors();
}

function generateAndDisplayVectors() {
  let n = parseInt(document.getElementById("vectorCount").value);
  if (!isNaN(n) && n > 0) {
    generateVectors(n);
    displayVectors();
  } else {
    alert("Please enter a valid number greater than 0.");
  }
}

function displayVectors() {
  let vectorButtonsContainer = document.getElementById("vectorButtons");
  vectorButtonsContainer.innerHTML = "";

  for (let i = 0; i < vectors.length; i++) {
    // let vector = generatedVectors[i];
    let vector = vectors[i];
    let button = document.createElement("button");
    button.textContent = `Vector ${i + 1}: (${vector.x.toFixed(
      2
    )}, ${vector.y.toFixed(2)}, ${vector.z.toFixed(2)})`;
    button.classList.add("vector-button");
    button.onclick = (function (index, btn) {
      return function () {
        movePrisoner(i, button);
        //   alert(`Clicked on Vector ${i + 1}`);
        // Add functionality as needed
      };
    })(i, button);
    vectorButtonsContainer.appendChild(button);
  }
}

// trying up
function drawUserPath() {
  stroke(255);
  strokeWeight(4);
  let arrowSize = 4;

  let x = centerX;
  let y = centerY;
  let z = centerZ;
  for (let vector of userPath) {
    let newX = x + vector.x;
    let newY = y + vector.y;
    let newZ = z + vector.z;

    drawArrow(createVector(x, y, z), createVector(newX, newY, newZ), arrowSize);

    x = newX;
    y = newY;
    z = newZ;
  }
}

function movePrisoner(index, button) {
  let vector = vectors[index];
  let newX = currentX + vector.x;
  let newY = currentY + vector.y;
  let newZ = currentZ + vector.z;

  if (dist(centerX, centerY, centerZ, newX, newY, newZ) <= yardRadius) {
    currentX = newX;
    currentY = newY;
    currentZ = newZ;
    userPath.push(vector);
    drawYard();
    vectors.splice(index, 1);
    displayVectors();
    // Change the button color to green and disable it
    button.style.backgroundColor = "green";
    button.onclick = null;
    button.disabled = true;

    if (vectors.length === 0) {
      if (dist(centerX, centerY, centerZ, currentX, currentY, centerZ) < 0.2) {
        alert("You win!");
        // showSolution();
      } else {
        alert("You lose! The prisoner did not return to the center.");
        showSolution();
      }
    }
  } else {
    alert("You lose! The prisoner crossed the boundary.");
    showSolution();
  }
}

// function drawArrow(base, vec, arrowSize) {
//   let angleXY = atan2(vec.y - base.y, vec.x - base.x); // Angle in the XY plane
//   let angleXZ = atan2(vec.z - base.z, vec.x - base.x); // Angle in the XZ plane
//   let angleYZ = atan2(vec.z - base.z, vec.y - base.y); // Angle in the YZ plane

//   push(); // Save the current drawing state
//   translate(base.x, base.y, base.z); // Move to the base of the arrow
//   line(0, 0, 0, vec.x - base.x, vec.y - base.y, vec.z - base.z); // Draw the main line of the arrow

//   // Move to the end of the main line
//   translate(vec.x - base.x, vec.y - base.y, vec.z - base.z);
//   rotate(angleXY); // Rotate to the direction of the vector in the XY plane

//   // Draw the two lines of the arrowhead in the XY plane
//   line(0, 0, 0, -arrowSize, arrowSize / 2, 0);
//   line(0, 0, 0, -arrowSize, -arrowSize / 2, 0);

//   // Rotate to the direction of the vector in the XZ plane
//   rotate(-angleXY); // Reset rotation in XY plane
//   rotate(angleXZ); // Rotate in XZ plane
//   line(0, 0, 0, -arrowSize, 0, arrowSize / 2);
//   line(0, 0, 0, -arrowSize, 0, -arrowSize / 2);

//   // Rotate to the direction of the vector in the YZ plane
//   rotate(-angleXZ); // Reset rotation in XZ plane
//   rotate(angleYZ); // Rotate in YZ plane
//   line(0, 0, 0, 0, -arrowSize, arrowSize / 2);
//   line(0, 0, 0, 0, -arrowSize, -arrowSize / 2);

//   pop(); // Restore the previous drawing state
// }

function drawArrow(base, vec, arrowSize) {
  push(); // Save the current drawing state
  translate(base.x, base.y, base.z); // Move to the base of the arrow
  line(0, 0, 0, vec.x - base.x, vec.y - base.y, vec.z - base.z); // Draw the main line of the arrow

  // Move to the end of the main line
  translate(vec.x - base.x, vec.y - base.y, vec.z - base.z);

  // Draw the small sphere as the arrowhead
  fill(255, 0, 0); // You can change the color as needed
  noStroke();
  sphere(arrowSize); // Draw the sphere with the given size

  pop(); // Restore the previous drawing state
}

// function drawArrow(base, vec, arrowSize) {
//     push(); // Save the current drawing state
//     translate(base.x, base.y, base.z); // Move to the base of the arrow
//     line(0, 0, 0, vec.x, vec.y, vec.z); // Draw the main line of the arrow

//     // Draw a sphere at the end of the arrow
//     let sphereRadius = arrowSize / 2; // Adjust the size of the sphere as needed
//     translate(vec.x, vec.y, vec.z); // Move to the end of the main line
//     noStroke();
//     fill(255, 0, 0); // Sphere color (you can change this)
//     sphere(sphereRadius); // Draw the sphere with the given radius

//     pop(); // Restore the previous drawing state
//   }

function findSolutionPath() {
  solutionPath = []; // Clear any previous solution path

  let path = [];
  let = tolerance = 0.1;

  function backtrack(x, y, z, remainingVectors) {
    // console.log(
    //   `Backtrack: x=${x}, y=${y}, z=${z}, remaining=${remainingVectors.length}`
    // );

    if (remainingVectors.length === 0) {
      // if (x === centerX && y === centerY && z === centerZ) {
      if (
        Math.abs(x - centerX) <= tolerance &&
        Math.abs(y - centerY) <= tolerance &&
        Math.abs(z - centerZ) <= tolerance
      ) {
        solutionPath = path.slice(); // Copy the path as the solution
        return true;
      } else {
        return false;
      }
    }

    for (let i = 0; i < remainingVectors.length; i++) {
      let vector = remainingVectors[i];
      let newX = x + vector.x;
      let newY = y + vector.y;
      let newZ = z + vector.z;

      if (dist(centerX, centerY, centerZ, newX, newY, newZ) <= yardRadius) {
        path.push(vector);
        // console.log(
        //   `Attempting vector ${i}: ${vector.x}, ${vector.y}, ${vector.z}`
        // );
        if (
          backtrack(
            newX,
            newY,
            newZ,
            remainingVectors.slice(0, i).concat(remainingVectors.slice(i + 1))
          )
        ) {
          return true;
        }
        path.pop();
      } else {
        // console.log(
        //   `Skipping vector ${i}: ${vector.x}, ${vector.y}, ${vector.z}`
        // );
      }
    }
    return false;
  }

  backtrack(centerX, centerY, centerZ, generatedVectors.slice());

  console.log("Solution Path:", solutionPath);
}

let animationIndex = 0;
let animationProgress = 0;
let animationSpeed = 0.08;

function showSolution() {
  findSolutionPath();
  if (solutionPath.length > 0) {
    animationIndex = 0;
    animationProgress = 0;
    currentX = centerX;
    currentY = centerY;
    currentZ = centerZ;
    isAnimating = true;
    // loop(); // Start animation loop
  } else {
    alert("No solution found.");
  }
}

function drawSolutionStep() {
  let arrowSize = 8;
  if (animationIndex < solutionPath.length) {
    let vector = solutionPath[animationIndex];
    let targetX = currentX + vector.x;
    let targetY = currentY + vector.y;
    let targetZ = currentZ + vector.z;

    // Calculate the current position of the animation based on progress
    let animX = lerp(currentX, targetX, animationProgress);
    let animY = lerp(currentY, targetY, animationProgress);
    let animZ = lerp(currentZ, targetZ, animationProgress);

    drawArrow(
      createVector(currentX, currentY, currentZ),
      createVector(animX, animY, animZ),
      arrowSize
    );

    // Draw the index near the arrow
    fill("white");
    noStroke();
    textSize(25);
    textAlign(LEFT, BASELINE);
    text(animationIndex + 1, (currentX + animX) / 2, (currentY + animY) / 2);

    // Update the progress of the current arrow
    animationProgress += animationSpeed;

    // If the arrow is fully drawn, move to the next arrow
    if (animationProgress >= 1) {
      currentX = targetX;
      currentY = targetY;
      currentZ = targetZ;
      animationProgress = 0;
      animationIndex++;
    }
  } else {
    // Stop the animation when all arrows are drawn
    // noLoop();
    isAnimating = false;
    alert("You Win");
  }
}

document
  .getElementById("solutionButton")
  .addEventListener("click", showSolution);

function updateAnimationSpeed(speed) {
  console.log("Animation speed changed to:", speed);
  animationSpeed = speed;
}

const rangeInput = document.getElementById("animationSpeedRange");
const numberInput = document.getElementById("animationSpeedNumber");

rangeInput.addEventListener("input", function () {
  animationSpeed = parseFloat(this.value);
  numberInput.value = this.value;
  updateAnimationSpeed(animationSpeed);
});

numberInput.addEventListener("input", function () {
  animationSpeed = parseFloat(this.value);
  rangeInput.value = this.value;
  updateAnimationSpeed(animationSpeed);
});
