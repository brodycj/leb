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

### encodeIntBuffer(buffer) -> encodedBuf
### decodeIntBuffer(encodedBuffer, [index]) -> { value: buffer, endIndex: num }

### encodeInt32(num) -> buffer
### decodeInt32(buffer, [index]) -> { value: num, endIndex: num }

### encodeInt64(num) -> buffer
### decodeInt64(buffer, [index]) -> { value: num, endIndex: num, lossy: bool }

### encodeUintBuffer(buffer) -> encodedBuf
### decodeUintBuffer(encodedBuffer, [index]) -> { value: buffer, endIndex: num }

### encodeUint32(num) -> buffer
### decodeUint32(buffer, [index]) -> { value: num, endIndex: num }

### encodeUint64(num) -> buffer
### decodeUint64(buffer, [index]) -> { value: num, endIndex: num, lossy: bool }


To Do
-----

* Finish the code.
* Flesh out docs.


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


