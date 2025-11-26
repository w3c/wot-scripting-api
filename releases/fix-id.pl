#!/usr/bin/perl

while (<>) {
  chomp;
  if (/id="webidl-([0-9]+)"/) {
    $num = $1;
  } elsif (/id="idl-def-wot"/) {
    s/id="idl-def-wot"/id="idl-def-wot-${num}"/;
  }
  print "$_\n";
}
