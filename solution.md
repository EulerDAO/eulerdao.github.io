<textarea id="srccode" style='width: 100%; height: 25vh'></textarea>
<textarea id="bytecode" style='width: 100%; height: 25vh'></textarea>
<a id='problem' style="display: block; text-align: center; visibility: hidden">Back to problem</a>
<a id='etherscan' style="display: block; text-align: center; visibility: hidden">View in etherum</a>
<a id='submitcode' onclick='window.solution.submit_code()' style="display: block; text-align: center; visibility: hidden">Submit your code</a>

<div id='noenter' style="visibility: hidden">
    <h3  style="display: block; text-align: center">Not Entered</h3>
    <label>Your Score:</label><input id='score' />
    <a id='compete' onclick='window.solution.compete()' style="display: block; text-align: center">Compete</a>
</div>
<div id='entered' style="visibility: hidden">
    <h3>Entered</h3>
    <h3 id='score'  style="display: block; text-align: center">Score: x</h3>
    <h3 id='rank' style="display: block; text-align: center; visibility: hidden">Rank: x</h3>
    <h3 id='challenger' style="display: block; text-align: center; visibility: hidden">Challenger: x</h3>
    <a id='lock' style="display: block; text-align: center" style="visibility: hidden" >Lock</a>
</div>
<script src="/assets/js/solution.js"></script>
