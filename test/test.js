// Copyright 2012 The Obvious Corporation.

/*
 * Tests for leb
 */


/*
 * Modules used
 */

"use strict";

var assert = require("assert");

var leb = require("../");


/*
 * Helper functions
 */

/**
 * Construct a (very) pseudo-random number generator.
 */
function Randomish(seed) {
  var x = 12345;
  var y = 1;
  var z = seed;

  this.nextByte = function nextByte() {
    x = ((x * 31) + y) & ~0;
    y = ((y * 2) + z + 1) & ~0;
    z = (x + y + z) & ~0;
    return (z + (z >>> 8) + (z >>> 16) + (z >>> 24)) & 0xff;
  }

  this.nextUInt32 = function nextUInt32() {
    var result = 0;
    for (var i = 0; i < 4; i++) {
      result = (result * 0x100) + this.nextByte();
    }
    return result;
  }

  this.nextUInt64 = function nextUInt64() {
    var lowWord = this.nextUInt32();
    var highWord = this.nextUInt32();
    return (highWord * 0x100000000) + lowWord;
  }
}

/**
 * Test the 32-bit encode/decode cycle for the given value, both as
 * signed and as unsigned.
 */
function testValue32(value) {
  var buf = leb.encodeUInt32(value);
  var decode = leb.decodeUInt32(buf);

  if (decode.endIndex !== buf.length) {
    throw new Error("Bad endIndex for " + value);
  }

  if (decode.value !== value) {
    throw new Error("Value mismatch for " + value);
  }

  value &= ~0; // Force it to be signed.
  buf = leb.encodeInt32(value);
  decode = leb.decodeInt32(buf);

  if (decode.endIndex !== buf.length) {
    throw new Error("Bad endIndex for " + value);
  }

  if (decode.value !== value) {
    throw new Error("Value mismatch for " + value);
  }
}

/**
 * Test the 64-bit encode/decode cycle for the given value, both as
 * signed and as unsigned.
 */
function testValue64(value) {
  var buf = leb.encodeUInt64(value);
  var decode = leb.decodeUInt64(buf);

  if (decode.endIndex !== buf.length) {
    throw new Error("Bad endIndex for " + value);
  }

  if (decode.value === value) {
    assert.ok(!decode.lossy, "Wrong lossy for " + value);
  } else {
    assert.ok(decode.lossy, "Wrong lossy for " + value);
  }

  // Force it to be signed.
  if (value >= 0x8000000000000000) {
    value -= 0x10000000000000000;
  }
  buf = leb.encodeInt64(value);
  decode = leb.decodeInt64(buf);

  if (decode.endIndex !== buf.length) {
    throw new Error("Bad endIndex for " + value);
  }

  if (decode.value === value) {
    assert.ok(!decode.lossy, "Wrong lossy for " + value);
  } else {
    assert.ok(decode.lossy, "Wrong lossy for " + value);
  }
}


/*
 * Test cases
 */

/**
 * Tests conversion of 32-bit zero.
 */
function testZero32() {
  testValue32(0);
}

/**
 * Tests each possible 32-bit int that just consists of a contiguous
 * chunk of 1-bits.
 */
function testContiguousBits32() {
  for (var bitCount = 1; bitCount <= 32; bitCount++) {
    var maxOffset = 32-bitCount;
    var baseValue = (~0 >>> maxOffset);
    for (var offset = 0; offset < maxOffset; offset++) {
      testValue32(baseValue << offset);
    }
  }
}

/**
 * Tests a (fixed but) pseudo-randomish series of values.
 */
function testMisc32() {
  var rand = new Randomish(123);

  for (var i = 0; i < 100000; i++) {
    testValue32(rand.nextUInt32());
  }
}

/**
 * Tests conversion of 64-bit zero.
 */
function testZero64() {
  testValue64(0);
}

/**
 * Tests each possible 64-bit int that just consists of a contiguous
 * chunk of 1-bits.
 */
function testContiguousBits64() {
  // Max bit count is 53, since floating point format can't represent
  // more than that.
  for (var bitCount = 1; bitCount <= 53; bitCount++) {
    var maxOffset = 64-bitCount;
    var baseValue = 1;

    for (var i = 1; i < bitCount; i++) {
      baseValue = (baseValue * 2) + 1;
    }

    for (var offset = 0; offset < maxOffset; offset++) {
      testValue64(baseValue);
      baseValue *= 2;
    }
  }
}

/**
 * Tests a (fixed but) pseudo-randomish series of values.
 */
function testMisc64() {
  var rand = new Randomish(65432);

  for (var i = 0; i < 100000; i++) {
    testValue64(rand.nextUInt64());
  }
}

      
testZero32();
testContiguousBits32();
testMisc32();
testZero64();
testContiguousBits64();
testMisc64();

console.log("All tests pass.");
