<h1>Walking in the Yard Game Demo</h1>
<p>This project is a game-like demo based on <em> Miniature-20 Walking in the Yard</em> from the book <em>33 Miniatures</em>. It includes both 2D and 3D versions, where players are given a set of vectors summing to zero and must use these vectors to reach the center of a yard without crossing the boundary. The project utilizes HTML, CSS, JavaScript, p5.js, and Flask.</p>

<h2>Project Overview</h2>

<h3>Concept</h3>
<p>A mathematically inclined prison guard forces a prisoner to take a walk under strict instructions. The prisoner receives a finite set M of vectors, each of length at most 5 meters. Starting at the center of a circular prison yard of radius 10 meters, the prisoner must move by each vector in M exactly once. The vectors sum up to 0, so the prisoner will finish at the center, but must avoid crossing the boundary at any time.</p>

<h3>Theorem</h3>
<p>It is possible to arrange all vectors of M into a sequence such that the prisoner’s path lies within a specific bound (e.g., within the circle). This holds true for higher dimensions as well.</p>

<h2>Demo</h2>
<p>You can try the game online at: <a href="http://walking-in-the-yard.onrender.com">Walking in the Yard Game Demo</a></p>


<h2>Features</h2>
<ul>
    <li><strong>2D Version</strong>: Players navigate using a set of 2D vectors to reach the center.</li>
    <li><strong>3D Version</strong>: Similar to the 2D version, but in a 3D space.</li>
    <li><strong>Solution Display</strong>: If players fail to find the correct path, they can view the solution.</li>
</ul>

<h2>Technologies Used</h2>
<ul>
    <li><strong>HTML</strong>: Structure of the game interface.</li>
    <li><strong>CSS</strong>: Styling for the interface.</li>
    <li><strong>JavaScript</strong>: Game logic and interaction.</li>
    <li><strong>p5.js</strong>: Visualization and interaction in 2D and 3D.</li>
    <li><strong>Flask</strong>: Backend server.</li>
</ul>



<h2>Contributing</h2>
<p>Contributions are welcome! Please follow these steps:</p>
<ol>
    <li>Fork the repository.</li>
    <li>Create a new branch (<code>git checkout -b feature-branch</code>).</li>
    <li>Make your changes.</li>
    <li>Commit your changes (<code>git commit -am 'Add new feature'</code>).</li>
    <li>Push to the branch (<code>git push origin feature-branch</code>).</li>
    <li>Create a new Pull Request.</li>
</ol>


<h2>Acknowledgments</h2>
<ul>
    <li><em>33 Miniatures</em> by the American Mathematical Society for the inspiration.</li>
    <li>The p5.js community for the visualization library.</li>
</ul>
