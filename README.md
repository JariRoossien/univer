# Report for Assignment 1

## Project chosen

Name: Univer

URL: [https://github.com/dream-num/univer](https://github.com/dream-num/univer)

Number of lines of code and the tool used to count it: 226237 counted through Lizard

Programming language: Typescript

## Coverage measurement

### Existing tool

<Inform the name of the existing tool that was executed and how it was executed>

<Show the coverage results provided by the existing tool with a screenshot>

## Your own coverage tool

<The following is supposed to be repeated for each group member>

### Team member: Chantal Ariu

#### Function 1: extractFilterValueFromCell

Link to commit: https://github.com/dream-num/univer/commit/e402af0b9c40e783b7c13e0542fe1cd0f4bfd2f4

Coverage tool results:
![alt text](image.png)
Out of the 15 branches, only 3 were hit with unchanged tests, meaning the coverage for this function is at 20%.

#### Function 2: InsertRowAfterCommand

Link to commit: https://github.com/dream-num/univer/commit/e3401afbd670d59a3f5052254282f1fcfe9a0ce1

Coverage tool results:
![alt text](image-1.png)
With the current tests, none of the 6 branches were hit, resulting in 0% coverage.

## Coverage improvement

### Individual tests

<The following is supposed to be repeated for each group member>

<Group member name>

### Team member: Chantal Ariu

#### Function 1: extractFilterValueFromCell
Link to commit: https://github.com/dream-num/univer/commit/95055e3b2f22a5597a4ab7f22d16ea747d545a40 

Coverage before improvement:
![alt text](image.png)

Coverage after improvement:
![alt text](image-2.png)

<State the coverage improvement with a number and elaborate on why the coverage is improved>
The coverage improvement is 80%, since the coverage started out at 20% and is now 100%. The way this was done was by creating tests that hit every branch.

#### Function 2: InsertRowAfterCommand
Link to commit: https://github.com/dream-num/univer/commit/b6afab73e679a01dc610f3fe051e68e742c9aaa1

Coverage before improvement:
![alt text](image-1.png)

Coverage after improvement:
![alt text](image-3.png)

The coverage improved by 83.3%, since in the beginning 0 branches were covered by the tests and after the improvements were made, 5 out of the 6 branches were hit. This was also done by writing tests that hit the branches.

### Overall

<Provide a screenshot of the old coverage results by running an existing tool (the same as you already showed above)>

<Provide a screenshot of the new coverage results by running the existing tool using all test modifications made by the group>

## Statement of individual contributions

<Write what each group member did>
