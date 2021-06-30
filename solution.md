<div id="code">Loading ...</div>
<a id='problem' style="display: block; text-align: center; visibility: hidden">Go to Problem</a>
<hr>

<div id='noenter' style="visibility: hidden">
    <h3  style="display: block; text-align: center">Not Entered</h3>
    <label >Your Score:</label><input id='score' />
    <a id='compete' onclick='window.solution.compete()' style="display: block; text-align: center">Compete</a>
</div>
<div id='entered' style="visibility: hidden">
    <h3 style="display: block; text-align: center">Entered</h3>
    <h3 id='showscore'  style="display: block; text-align: center">Score: x</h3>
    <h3 id='rank' style="display: block; text-align: center; visibility: hidden">Rank: x</h3>
    <h3 id='challenger' style="display: block; text-align: center; visibility: hidden">Challenger: x</h3>
    <a id='lock' onclick='window.solution.lock()' style="display: block; text-align: center; visibility: hidden" >Lock</a>
    <a id='challenge' onclick='window.solution.challenge()' style="display: block; text-align: center;visibility: hidden"  >Challenge</a>
    <a id='revoke' onclick='window.solution.revoke()' style="display: block; text-align: center;visibility: hidden" >Revoke</a>
</div>
<script src="/assets/js/solution.js"></script>
