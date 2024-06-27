# Report for Assignment 1

## Project chosen

Name: Univer

URL: [https://github.com/dream-num/univer](https://github.com/dream-num/univer)

Number of lines of code and the tool used to count it: 226237 counted through Lizard
![afbeelding](https://github.com/JariRoossien/univer/assets/54411538/1df0df38-1241-4542-a80e-ecf65b2082fa)

Programming language: Typescript

## Coverage measurement

### Existing tool

<Inform the name of the existing tool that was executed and how it was executed>

The project is compiled with `vite` , and the test tool `vitest` is able to generate a local coverage report. By executing `pnpm run coverage`, the package.json calls `Turbo`, which calls `vitest run --coverage` for each package. Turbo is the management tool to compile the different packages of this repository into a single product.
    
As this repository is a mono repository, each package generates their own report. To get a global report, we have implemented a script called `merge-coverage.cjs`. This script copies all the local `coverage-final.json` into a `coverage/.nyc_output` folder, as `{package}-coverage.json`. Finally it calls `nyc report --reporter=html --reporter=text-summary`. This generates the same report as each `vitest run --coverage`, but as it contains all the coverage overviews, it will generate the report for the global coverage.
    
<Show the coverage results provided by the existing tool with a screenshot>
    
![firefox_Wl2v3WhjCP](https://github.com/JariRoossien/univer/assets/54411538/b0b25d68-d9d2-4b64-b60f-934be7988e39)


### Your own coverage tool

<The following is supposed to be repeated for each group member>

#### Jari Roossien

#### getFormulaItemBySId

##### Implementation Commit
https://github.com/JariRoossien/univer/commit/ef90d965ead24dd295f9bea6e39dbd83ec3ed538

##### Branch Result
![afbeelding](https://github.com/JariRoossien/univer/assets/54411538/2cbcabb1-c7d0-4f9d-a752-37d2de00331b)

#### clearPreviousArrayFormulaCellData

##### Implementation Commit
https://github.com/JariRoossien/univer/commit/50c0accdc9a46b093bb0114481c3325fc2f9cfb7

##### Branch Result
![afbeelding](https://github.com/JariRoossien/univer/assets/54411538/ccbe08b1-e099-4d2f-ae07-c81c6035d6d7)

                        
#### Team Member: Sanjay Chacku Purakal

##### SetWorksheetShowCommand()

[Github Commit](https://github.com/JariRoossien/univer/tree/521c2d1cff201c2bf9c4495505c0dfc7b1f9d5f5)

![Coverage Report for SetWorksheetShowCommand showing 0% coverage before adding tests](images/setWorksheetShowCommand-Before.jpeg)

##### setEndForRange()

[Github Commit](https://github.com/JariRoossien/univer/tree/dc771281840c7e80bec107ee43dcbe9f70103f76)

![Coverage Report for setEndForRange showing 0% coverage before adding tests](images/setEndForRange-Before.jpeg)
                        
                        
#### Team member: Chantal Ariu

##### Function 1: extractFilterValueFromCell

Link to commit: https://github.com/dream-num/univer/commit/e402af0b9c40e783b7c13e0542fe1cd0f4bfd2f4

Coverage tool results:
![alt text](image.png)
Out of the 15 branches, only 3 were hit with unchanged tests, meaning the coverage for this function is at 20%.

##### Function 2: InsertRowAfterCommand

Link to commit: https://github.com/dream-num/univer/commit/e3401afbd670d59a3f5052254282f1fcfe9a0ce1

Coverage tool results:
![alt text](image-1.png)
With the current tests, none of the 6 branches were hit, resulting in 0% coverage.

#### Team member: Ly Le

##### Function 1: isAllFormatInTextRuns

Link to commit: https://github.com/JariRoossien/univer/commit/ddc266f6ca82e8f459bccd3341feba3e633b1dc8

Coverage tool results:
![afbeelding](https://github.com/JariRoossien/univer/assets/54411538/b8686894-9ed6-4666-84d1-88d7b8ba58f4)

3 out of 7 were hit, meaning a branch coverage of 43% 

##### Function 2: isValidRange

Link to commit: https://github.com/JariRoossien/univer/commit/df9614ae2ee8b45cd76ff3b324276241f8b918bc

Coverage tool results:

![afbeelding](https://github.com/JariRoossien/univer/assets/54411538/fd2df3fc-30ac-4b6c-8d88-03a8e6c5340c)

None of the 8 branches were hit, giving a 0% coverage.

## Coverage improvement

### Individual tests

<The following is supposed to be repeated for each group member>

### Team Member: Jari Roossien

#### getFormulaItemBySId()

##### Before
![afbeelding](https://github.com/JariRoossien/univer/assets/54411538/2cbcabb1-c7d0-4f9d-a752-37d2de00331b)


##### After
![afbeelding](https://github.com/JariRoossien/univer/assets/54411538/3cf83bd3-a581-47d0-84ef-92420e41172b)

The branch coverage has been improved from 0 branches covered, to 7 out of 8 branches covered (87.5%).
As there weren't any tests, most edge cases have been found. This contains different cases such as the unitID of the sheet not existing, the SheetID not existing, or the SId not existing. As the test suite created a mock object for a different test case, I modified the values to check for true and false based on the data as described in the mock sheet. The tests themselves check for all the possible nullified values and makes sure the function catches them.

#### clearPreviousArrayFormulaCellData

##### Before
![afbeelding](https://github.com/JariRoossien/univer/assets/54411538/ccbe08b1-e099-4d2f-ae07-c81c6035d6d7)

##### After
![afbeelding](https://github.com/JariRoossien/univer/assets/54411538/304f6d47-cb3e-4424-a48e-ef21aaf7c885)

For coverage has been improved from 0 branches covered, to 9 out of 11 branches covered (81.8%). 
This function was originally tested using the given formulaDataModelArray that was mocked by the test suite. For each run, a different input was mocked, starting from completely nullified values, to completely correct, and partially missing data. As the test worked with a formula range that was given by a different function, some tests mocked that given data before the function itself was called, to make sure in different situation the code would behave as expected.

### Team Member: Sanjay Chacku Purakal

#### SetWorksheetShowCommand()

[Github Commit](https://github.com/JariRoossien/univer/tree/9bfd026c8a5d9e96685a9c6cb22008c086ddfdca)

##### Before
![Coverage Report for SetWorksheetShowCommand showing 0% coverage before adding tests](images/setWorksheetShowCommand-Before.jpeg)

##### After
![Coverage Report for SetWorksheetShowCommand showing 81.82% coverage after adding tests](images/setWorksheetShowCommand-After.jpeg)

The code coverage has been improved from 0% (0/11 branches) to 81.82% (9/11 branches).
The coverage has been improved by considering many edge cases and ensuring all cases in which a program can fail are tested.
For this some test cases had to be specifically constructed since the test case should only fail if another part of the program malfunctions or is changed. To emulate this, flawed inputs where constructed artificially and the brach coverage was achieved by the program catching those exceptions and handling them appropriately.

#### setEndForRange()

[Github Commit](https://github.com/JariRoossien/univer/tree/13d355d6ee7ef0388dc3159525270a4e6492a288)

##### Before
![Coverage Report for setEndForRange showing 0% coverage before adding tests](images/setEndForRange-Before.jpeg)

##### After
![Coverage Report for setEndForRange showing 100% coverage after adding tests](images/setEndForRange-After.jpeg)

The code coverage has been improved from 0% (0/9 branches) to 100% (9/9 branches).
The function is intended to replace NaN values in a range with the extremes (0 or max - 1). For this purpose the tests supply a NaN value in ecah of the possible positions. The branch coverage is then achieved by the program handling all NaN values and replacing them with the correct default values.

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

### Team member: Ly Le

#### Function 1: isAllFormatInTextRuns
Link to commit: https://github.com/JariRoossien/univer/commit/ec699062f8eb8187fed36378ee35ae8c37614e35 
https://github.com/JariRoossien/univer/commit/5fa144f88ba37f4bd0da536ccfd4e60f1bab0619

Coverage before improvement:

![afbeelding](https://github.com/JariRoossien/univer/assets/54411538/b8686894-9ed6-4666-84d1-88d7b8ba58f4)


Coverage after improvement:

![afbeelding](https://github.com/JariRoossien/univer/assets/54411538/03ee6ccf-5bc3-4268-808e-81b4075de4eb)

Coverage has been improved from 3/7 (42%) to 7/7 (100%). The original test only checked for a correct statement when the content was bold. I have implemented tests where these were not completely covered, where the effect is disabled, or where different effects have been used.

#### Function 2: isValidRange
Link to commit: https://github.com/JariRoossien/univer/commit/7870a34be59283120b4532d488c9e1b577bf2a14

Coverage before improvement:

![afbeelding](https://github.com/JariRoossien/univer/assets/54411538/fd2df3fc-30ac-4b6c-8d88-03a8e6c5340c)

Coverage after improvement:

![afbeelding](https://github.com/JariRoossien/univer/assets/54411538/524ebb23-8f89-48b4-ac96-685f801fe0dd)

Coverage has improved from 0 branches hit, to all 8 branches hit, giving a 100% coverage. 
The coverage has been improved by creating test cases for multiple possiblities. Ranging from just having valid inputs, to leaving certain values at NaN or empty to trigger the if statement clauses.

### Overall

#### Old Coverage

![firefox_Wl2v3WhjCP](https://github.com/JariRoossien/univer/assets/54411538/b0b25d68-d9d2-4b64-b60f-934be7988e39)


<Provide a screenshot of the new coverage results by running the existing tool using all test modifications made by the group>

#### New Coverage

![firefox_sjbbH60tgb](https://github.com/JariRoossien/univer/assets/54411538/7bc57c0d-8baa-467b-9028-592f0073b300)

Improvements made:
- +0.27% statement coverage
- +0.31% branch coverage
- +0.15% function coverage
- +0.27% line coverage


## Statement of individual contributions

<Write what each group member did>


### Jari Roossien
Set up github repository, implemented custom script to combine existing tooling for code coverage, implemented tests and coverage tooling for getFormulaItemBySId and clearPreviousArrayFormulaCellData. 

### Sanjay Chacku Purakal
Implemented tests and coverage tool for SetWorksheetShowCommand and setEndForRange

### Chantal Ariu
Implemented tests and coverage tooling for `extractFilterValueFromCell` function and `InsertRowAfterCommand` command.

### Ly Le
Added tests and coverage tool for isValidRange and isAllFormatInTextRuns
