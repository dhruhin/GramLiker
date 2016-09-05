#!/bin/bash
read user < "username"
read pass < "password"
eval "phantomjs --cookies-file=cookies.txt sign-in.js $user $pass";
while read p; do
  eval "phantomjs --cookies-file=cookies.txt visitPage.js $p";
  for i in `seq 0 2`;
  do
    eval "phantomjs --cookies-file=cookies.txt likePost.js $i";
  done
done <./handles.txt
