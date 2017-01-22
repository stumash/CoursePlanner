library(readr)
library(stringr)

# load the data
softengcourses <- read_csv("SoftEndCoursesOnly.csv",col_names = T) #a single vector of course codes
df <- read_csv("courseSheet.csv",col_names = T) #a dataframe of courses

relevantIndices <- which(df$code %in% softengcourses$CourseCodes)
soendf <- df[relevantIndices,] #reduce df down to only containing soen courses

# clean out the 'none' values
soendf <- sapply(soendf, function(col) {
  str_replace(col,"none","")
})

# remove extra columns
ncol(soendf)
soendf <- soendf[,-c(ncol(soendf)-1,ncol(soendf))]

# oh crap it was a matrix this whole time
soendf <- data.frame(soendf)

# replace na with empty string 
soendf$note <- as.character(soendf$note)
soendf$note[is.na(soendf$note)] <- ""

# remove another useless column off the end
soendf <- soendf[,-c(ncol(soendf))]

# oh crap need to change all factors to character
soendf <- data.frame(lapply(soendf,as.character),stringsAsFactors = F)

# coreqs involving CEGEP math are removed
soendf$corequisites[str_detect(soendf$corequisites, "Cegep")] <- ""

# bad colname fix
colnames(soendf)[ncol(soendf)-1] <- "semestersOffered"

write_csv(soendf,"soendf.csv")
View(soendf)