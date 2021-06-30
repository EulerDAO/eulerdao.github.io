<div id="code">Loading ...</div>
<a id='problem' style="display: block; text-align: center; visibility: hidden">Go to Problem</a>
<hr>
<table id='info' style="visibility: hidden">
  <tr>
    <th>Score</th>
    <td id='td-score'>0</td>
  </tr>
  <tr>
    <th>Owner</th>
    <td id='td-owner'>0x0000000000000000000000000000000000000000</td>
  </tr>
  <tr>
    <th>Challenger</th>
    <td id='td-challenger'>0x0000000000000000000000000000000000000000</td>
  </tr>
  <tr>
    <th>Chanllenge Time</th>
    <td id='td-timestamp'>1970-01-01 00:00:00</td>
  </tr>
  <tr>
    <th>Rank</th>
    <td id='td-rank'>TODO</td>
  </tr>
</table>


<div id='noenter' style="visibility: hidden">
    <h3  style="display: block; text-align: center">Not Entered</h3>
    <div style='align-items: center;/* width: 50%; */margin: auto auto;display: flex;justify-content: center;'><label styple="vertical-align:middle;display:inline-block; ">Your Score:</label><input style='text-align:center;vertical-align:middle;' id='score' /></div>
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
