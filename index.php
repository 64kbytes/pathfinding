<html>
	<head>
		<title>Tilemap</title>
		<link rel='stylesheet' href='./tilemap.css'/>
		<script src='./jquery.js'></script>
		<script src='./astar.js'></script>
		<script src='./tilemap.js'></script>
	</head>
	<body>
		<div id='debug'></div>
		<table>
			<?php
				$tile = array(
					'empty', // 0
					'forest blocked', // 1
					'house blocked', // 2
					'store blocked', // 3
					'road', // 4
					'library blocked', // 5
					'revolver', // 6
					'wall blocked',
					'barbed-wire blocked',
					'fence',
					'forbidden blocked',
					'grass',
					'water blocked'
				);
				$map = array(
					array(0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12),
					array(0, 0, 0, 0, 0, 7, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12),
					array(0, 0, 0, 0, 0, 7, 0, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 12),
					array(0, 0, 0, 0, 0, 7, 0, 5, 0, 1, 0, 0, 0, 0, 0, 0, 0, 12),
					array(0, 0, 8, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12),
					array(0, 0, 0, 0, 0, 3, 0, 0, 6, 0, 0, 0, 0, 0, 0, 12),
					array(0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12),
					array(0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12),
					array(0, 0, 8, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 12),
					array(0, 0, 2, 1, 0, 0, 0, 0, 12, 12, 12, 12, 12),
					array(0, 0, 1, 1, 0, 0, 1, 12, 0, 0, 0, 12),
					array(0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 12),
					array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12),
					array(0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 12),
					array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12),
					array(0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 12)
				);
			?>
<?php
			<?php 
				for($y = 0; $y < count($map); $y++){
					echo "<tr id='y-{$y}'>";
					for($x = 0; $x < count($map[$y]); $x++){
						echo "<td id='x-{$x}' class='terrain {$tile[$map[$y][$x]]}'></td>";
					}
					echo "</tr>";
				}
			?>
		</table>
	</body>
</html>
