function biasResult(xnum, xbias) {
	// adjust inpuyt to make control feel more linear
	var k = Math.pow(1-xbais, 3);
	// equation based on shadertoy.com/view/Xd2yRd
	return (xnum * k) / (xnum * k - x + 1);
}