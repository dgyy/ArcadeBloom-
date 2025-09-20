import os

# Read the content of a list of files and put the reulst in a list
def readFiles (filesList):
    result = []
    for inputfile in filesList:
        if os.path.exists(inputfile):
            print('Get lines from ' + inputfile)
            curFile = open(inputfile,'r')
            result += curFile.readlines()
            curFile.close() 
    return result
    
# Delete, from a list of lines, lines that are empty and comments
def clean (inputLines):
    cleanLines = []
    for line in inputLines:
        lineStriped = line.strip() # Remove leading and trailing spaces
        if (lineStriped != '\n' and lineStriped[0:2] != '//' and lineStriped != ''): # Remove comments and empty lines
            cleanLine = lineStriped\
                        .replace(' =','=').replace('= ','=')\
                        .replace(' <','<').replace('< ','<')\
                        .replace(' >','>').replace('> ','>')\
                        .replace(' :',':').replace(': ',':')\
                        .replace(' (','(').replace('( ','(')\
                        .replace(' )',')').replace(') ',')')\
                        .replace(' {','{').replace('{ ','{')\
                        .replace(' }','}').replace('} ','}')\
                        .replace(' [','[').replace('[ ','[')\
                        .replace(' ]',']').replace('] ',']')\
                        .replace(' +','+').replace('+ ','+')\
                        .replace(' -','-').replace('- ','-')\
                        .replace(' *','*').replace('* ','*')\
                        .replace(' /','/').replace('/ ','/')\
                        .replace(' ,',',').replace(', ',',')\
                        .replace(' .','.').replace('. ','.')\
                        .replace(' ;',';').replace('; ',';')\
                        .replace(' ||','||').replace('|| ','||')\
                        .replace(',"_t":[8,8,8,"","","","",""]','')
            cleanLines.append(cleanLine) 
    return cleanLines

# Uglify a list of lines takeing into account a list of strings to uglify
def uglify (inputLines, stringsToUglify):
    # Prepare the ugly strings
    alphabet='abcdefghijklmnopqrstuvwxyz'
    uglyStrings=[]
    for i in alphabet:
        for j in alphabet:
            if not (i+j in ['do','if','in']):
                uglyStrings.append(i+j)
    # For each line, uglyfy
    uglyLines=[]
    for line in inputLines:
        uglyLine=line
        i=0
        # Uglify each string
        for stringToReplace in stringsToUglify:
            uglyValue=uglyStrings[i]
            uglyLine = uglyLine.replace(stringToReplace,uglyValue)
            i+=1
        uglyLines.append(uglyLine)

    return uglyLines

# Write a list of lines to a file
def writeResult (inputLines, outputFile):
     # Delete outputfile if exists
    if os.path.exists(outputFile):
        os.remove(outputFile)   
    # Create outputfile
    output = open(outputFile,'w')
    # Write the lines
    PreviousLine='Initialisation'
    for line in inputLines:
        if not (line in ['}','},',')','),']) \
           and not (line[0:4].lower()=='else')\
           and not (PreviousLine == 'Initialisation')\
           and not (PreviousLine[-1] in ['{','(',',']):
            output.write(';')
        output.write(line)
        PreviousLine=line
    # Close outputfile
    output.close()
    
# Write a list of lines to a file
def writeResultNoTransfo (inputLines, outputFile):
     # Delete outputfile if exists
    if os.path.exists(outputFile):
        os.remove(outputFile)   
    # Create outputfile
    output = open(outputFile,'w')
    # Write the lines
    for line in inputLines:
        output.write(line)
    # Close outputfile
    output.close()

# Function that does all the work
def build(inputFiles, stringsToUglify, outputFile):
    lines=readFiles (inputFiles)
    cleanLines=clean(lines)
    uglyLines=uglify(cleanLines,stringsToUglify)
    writeResult(uglyLines,outputFile)

