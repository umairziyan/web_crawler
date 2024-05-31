function printReport(pages) {
  console.log("Report is starting");
  const sortedPages = sortPages(pages);
  for (const sortedPage of sortedPages) {
    console.log(`Found ${sortedPage[0]} internal links to ${sortedPage[1]}`);
  }
}

function sortPages(pages) {
  const pagesArray = Object.entries(pages);
  pagesArray.sort((pageA, pageB) => {
    if (pageB[1] === pageA[1]) {
      return pageA[0].localeCompare(pageB[0]);
    }
    return pageB[1] - pageA[1];
  });
  return pagesArray;
}

export { printReport, sortPages };
