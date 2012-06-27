leb: LEB128 utilities for Node
==============================

This Node module provides several utility functions for
dealing with the LEB128 family of integer representation formats.

LEB128, which is short for "Little-Endian Base 128") is somewhat like
UTF-8 in representing numbers using a variable number of bytes. Unlike
UTF-8, LEB128 uses just the high bit of each byte to determine the
role of a byte. This makes it a somewhat more compact representation
but with some cost in terms of the complexity on the read side.

LEB128 was first defined as part of the 
[DWARF 3 specification](http://dwarfstd.org/Dwarf3Std.php), and it
is also used in Android's
[DEX file format](http://http://source.android.com/tech/dalvik/dex-format.html).

This module provides encoders and decoders for both signed and
unsigned values, and with the decoded form being any of 32-bit
integers, 64-bit integers, and arbitrary-length buffer (taken to be a
bigint-style representation in little-endian order).

The 64-bit integer form requires a special note: Because JavaScript
can't represent all possible 64-bit integers in its native number
type, the 64-bit decoder methods return a `lossy` flag which indicates
if the decoded result isn't exactly the number represented in the
encoded form.


Building and Installing
-----------------------

```shell
npm install leb
```

Or grab the source. As of this writing, this module has no
dependencies, so once you have the source, there's nothing more to do
to "build" it.


Testing
-------

```shell
npm test
```

Or

```shell
node ./test/test.js
```


API Details
-----------


### decodeInt32(buffer, [index]) -> { value: num, endIndex: num }

Takes a signed LEB128-encoded byte sequence in the given buffer at the
given index (defaults to `0`), returning the decoded value and the
index just past the end of the encoded form. The value is expected to
be a 32-bit integer.

This throws an exception if the buffer doesn't have a valid encoding
at the index (only possibly true if the last byte in the buffer has
its high bit set) or if the decoded value is out of the range of the
expected type.

### decodeInt64(buffer, [index]) -> { value: num, endIndex: num, lossy: bool }

Takes a signed LEB128-encoded byte sequence in the given buffer at the
given index (defaults to `0`), returning the decoded value, the index
just past the end of the encoded form, and a boolean indicating
whether the decoded value experienced numeric conversion loss. The
value is expected to be a 64-bit integer.

This throws an exception if the buffer doesn't have a valid encoding
at the index (only possibly true if the last byte in the buffer has
its high bit set) or if the decoded value is out of the range of the
expected type.

### decodeIntBuffer(encodedBuffer, [index]) -> { value: buffer, endIndex: num }

Takes a signed LEB128-encoded byte sequence in the given buffer at the
given index (defaults to `0`), returning the decoded value and the
index just past the end of the encoded form. The decoded value is a
bigint-style buffer representing a signed integer, in little-endian
order.

This throws an exception if the buffer doesn't have a valid encoding
at the index (only possibly true if the last byte in the buffer has
its high bit set).

### decodeUint32(buffer, [index]) -> { value: num, endIndex: num }

Like `decodeInt32`, but with the unsigned LEB128 format and unsigned
32-bit integer type.

### decodeUint64(buffer, [index]) -> { value: num, endIndex: num, lossy: bool }

Like `decodeInt64`, but with the unsigned LEB128 format and unsigned
64-bit integer type.

### decodeUintBuffer(encodedBuffer, [index]) -> { value: buffer, endIndex: num }

Like `decodeIntBuffer`, but with the unsigned LEB128 format.

### encodeInt32(num) -> buffer

Takes a 32-bit signed integer, returning the signed LEB128 representation
of it.

### encodeInt64(num) -> buffer

Takes a 64-bit signed integer, returning the signed LEB128 representation
of it.

### encodeIntBuffer(buffer) -> encodedBuf

Takes a bigint-style buffer representing a signed integer, returning the
signed LEB128 representation of it.

### encodeUint32(num) -> buffer

Like `encodeInt32`, but with the unsigned 32-bit integer type and returning
unsigned LEB128.

### encodeUint64(num) -> buffer

Like `encodeInt64`, but with the unsigned 64-bit integer type and returning
unsigned LEB128.

### encodeUintBuffer(buffer) -> encodedBuf

Like `encodeInt32`, but with the buffer argument in unsigned bigint form
and returning unsigned LEB128.


To Do
-----

* Figure out something to do.


Contributing
------------

Questions, comments, bug reports, and pull requests are all welcome.
Submit them at [the project on GitHub](https://github.com/Obvious/leb/).

Bug reports that include steps-to-reproduce (including code) are the
best. Even better, make them in the form of pull requests that update
the test suite. Thanks!


Author
------

[Dan Bornstein](https://github.com/danfuzz)
([personal website](http://www.milk.com/)), supported by
[The Obvious Corporation](http://obvious.com/).


License
-------

Copyright 2012 [The Obvious Corporation](http://obvious.com/).

Licensed under the Apache License, Version 2.0. 
See the top-level file `LICENSE.txt` and
(http://www.apache.org/licenses/LICENSE-2.0).


