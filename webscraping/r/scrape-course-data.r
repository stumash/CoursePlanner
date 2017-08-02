# import packages
library(rvest) # scraping and html parsing
library(stringr) # regex utilities
library(dplyr) # data frame manipulation
library(readr) # read and write tables
library(jsonlite) # df to json conversion, json prettify

# all (url, css-selector) pairs to scrape from
urls.and.css.selectors <- read_lines("courseinfo-data-sources.txt")
num.scrapes <- length(urls.and.css.selectors) / 3

# store the 3-tuples (program.name, url, css.selector) in three vectors
program.names <- urls.and.css.selectors[seq(from = 1, to = length(urls.and.css.selectors), by = 3)]
urls          <- urls.and.css.selectors[seq(from = 2, to = length(urls.and.css.selectors), by = 3)]
css.selectors <- urls.and.css.selectors[seq(from = 3, to = length(urls.and.css.selectors), by = 3)]
rm(urls.and.css.selectors)

#for(i in 1:num.scrapes) {
i <- 2
    # print(i)
    # print(program.name[i])

    htmlpage.string <- read_html(urls[i]) # get the raw html
    program.html.string <- htmlpage.string %>%
        html_node(css = css.selectors[i]) # extract desired DOM

    # match "course info header" of each course on concordia web site
    # ...something like 'SOEN 555    Systems'
    course.info.header.rgx <- "[A-Z]{4} [0-9]{3}[[:space:]]+?[A-Z][a-z]+."

    # split text on empty string before each course.info.header.rgx match, convert to data frame
    program.courses <- html_text(program.html.string) %>%
        str_split( paste(sep = "", "(?=(", course.info.header.rgx, "))") )

    # list to data-frame R nonsense
    program.courses <- program.courses %>% .[[1]] %>% .[-1] %>%
        as.data.frame(stringsAsFactors = FALSE)
    colnames(program.courses) <- c("fullstring") # also better column name

    # some cleaning of the full string of each course extracted for each course
    program.courses[,1] <- str_trim(program.courses[,1]) # trim whitespace of ends of strings
    program.courses[,1] <- str_replace_all(program.courses[,1], "\\s+", " ") # many adjacent whitespaces to single space
    program.courses[,1] <- str_replace_all(program.courses[,1], "-\n", "") # remove shitty manual line-wraps

    # some regexes for data extraction from full string
    course.code.rgx <- '[A-Z]{4} [0-9]{3}'
    course.name.rgx <- '[A-Z][a-z][^(]*'
    credits.rgx <- '\\(([0-9](\\.[0-9])?[0-9]?) credits\\)'
    prereqs.rgx <- 'Prerequisite: ([^.]*)'

    # extracting the regexes to new columns in the program.courses data frame
    program.courses <- program.courses %>% # str_extract only takes first occurence of regex
        mutate(code = str_extract(program.courses$fullstring, course.code.rgx))
    program.courses <- program.courses %>%
        mutate(name = str_extract(program.courses$fullstring, course.name.rgx) %>% str_trim)
    program.courses <- program.courses %>%
        mutate(credits = str_match(program.courses$fullstring, credits.rgx) %>% .[,2])
    program.courses <- program.courses %>%
        mutate(prereq.string = program.courses$fullstring %>% str_match(prereqs.rgx) %>% .[,2])
    
    # create column 'secondhalf.string', smaller than 'fullstring' to extract more fields from
    program.courses <- program.courses %>%
        mutate(secondhalf.string = program.courses$fullstring %>% str_split('\\. ', n = 2) %>%
               sapply(function(x) x[2]) %>% str_trim)

    # some regexes for data extraction from column 'secondhalf.string'
    lectures.rgx <- 'Lectures: ([^.]*)'
    tutorials.rgx <- 'Tutorial: ([^.]*)'
    laboratory.rgx <- 'Laboratory: ([^.]*)'
    note.rgx <- 'NOTE: (.*)'
    course.description.rgx <- '.*?(?=(Lecture|Tutorial|Laboratory|\nNOTE|$))'

    # extracting the regex to new columns in the program.courses data frame
    program.courses <- program.courses %>%
        mutate(description = program.courses$secondhalf.string %>% str_extract(course.description.rgx))
    program.courses <- program.courses %>%
        mutate(lecture.hours = program.courses$secondhalf.string %>% str_match(lectures.rgx) %>% .[,2])
    program.courses <- program.courses %>%
        mutate(tutorial.hours = program.courses$secondhalf.string %>% str_match(tutorials.rgx) %>% .[,2])
    program.courses <- program.courses %>% 
        mutate(lab.hours = program.courses$secondhalf.string %>% str_match(laboratory.rgx) %>% .[,2])
    program.courses <- program.courses %>%
        mutate(note = program.courses$secondhalf.string %>% str_match(note.rgx) %>% .[,2])

    #------------------------------------------------------------------------------------
    # BEGIN PARSING PREREQ STRING INTO JSON OBJECT
    
    # temp variable for prereq strings
    prereq.strings <- program.courses$prereq.string
    
    #'COMP 222, 333'/'COMP 222 or 333' to 'COMP 222, COMP 333'/'COMP 222 or COMP 333'. 4 times for good measure
    prereq.strings <- gsub("([A-Z]{4} )([0-9]{3}(,| or) )([0-9]{3})", "\\1\\2\\1\\4", prereq.strings)
    prereq.strings <- gsub("([A-Z]{4} )([0-9]{3}(,| or) )([0-9]{3})", "\\1\\2\\1\\4", prereq.strings)
    prereq.strings <- gsub("([A-Z]{4} )([0-9]{3}(,| or) )([0-9]{3})", "\\1\\2\\1\\4", prereq.strings)
    prereq.strings <- gsub("([A-Z]{4} )([0-9]{3}(,| or) )([0-9]{3})", "\\1\\2\\1\\4", prereq.strings)
    
    # some rgxes for data extraction from column 'prereq.string'
    prereqs.split.rgx <- '[,;] ' # split on colon
    coreq.rgx <- 'previously or concurrently'
    
    # parse prereq.string into list object 'rqmts'
    prereq.strings <- str_split(prereq.strings, prereqs.split.rgx) # split to list of vectors
    prereq.strings <- lapply(prereq.strings, function(prereq.vector) {
      which.courses <- str_detect(prereq.vector, course.code.rgx)# extract strings containing course codes
      which.coreqs <- str_detect(prereq.vector, coreq.rgx)# extract strings containing coreqs
      # list of coreq course code vectors
      coreqs <- prereq.vector[which.coreqs & which.courses] %>% str_extract_all(course.code.rgx)
      # list of prepreq course code vectors
      prereqs <- prereq.vector[(! which.coreqs) & which.courses] %>% str_extract_all(course.code.rgx)
      list('prereqs' = prereqs, 'coreqs' = coreqs)
    })
    
    program.courses <- program.courses %>% mutate(requirements = prereq.strings)
    
    # END PARSING PREREQ STRING INTO JSON OBJECT
    #------------------------------------------------------------------------------------
    
    # store and remove redundant data from program.courses data frame
    full.course.strings <- program.courses$fullstring %>% as.data.frame(stringsAsFactors = FALSE)
    colnames(full.course.strings) <- c("contents")
    # remove columns 'fullstring' and 'secondhalf.string' from program.courses data frame
    program.courses <- program.courses %>% select(-one_of(c('fullstring')))
    program.courses <- program.courses %>% select(-one_of(c('secondhalf.string')))
    program.courses <- program.courses %>% select(-one_of(c('prereq.string')))

    # store data in JSON-formatted files
    file.connection <- file(paste(sep = "_", paste(sep="", "course-info-jsonfiles/", program.names[i]), "full-course-info.json"))
    writeLines(prettify(toJSON(full.course.strings)), file.connection); close(file.connection)
    file.connection <- file(paste(sep = "_", paste(sep="", "course-info-jsonfiles/", program.names[i]), "document.json"))
    writeLines(prettify(toJSON(program.courses)), file.connection); close(file.connection)
#}

    