import axios from 'axios'
import {load} from 'cheerio'
import xlsx from 'xlsx'
import fs from 'fs'

const fileName = "./file.txt"
const url = "https://internshala.com/jobs/?utm_source=is_header"
async function dataScraping(){
    try{
        const response = await axios.get(url)
        writeData(fileName,response.data)
        let finalData = readData(fileName);
        const html=finalData;
        const j$=load(html);

        const data=[];

        
        const jobs = j$('.container-fluid.individual_internship.view_detail_button.visibilityTrackerItem');

        console.log(jobs);
        
        jobs.each((_,el)=>{
            const conatiner=j$(el);
            
            const jobName=conatiner.find('.job-internship-name').text();
            const companyName=conatiner.find('.company-name').text();
            const location =conatiner.find('span a').text();
            const postedDate = conatiner.find('.status-success span').text();
            
            data.push([
                jobName,
                companyName,
                location,
                postedDate
            ])
        

       })

       const workbook=xlsx.utils.book_new();
       const sheet=xlsx.utils.aoa_to_sheet(data);

       xlsx.utils.book_append_sheet(workbook,sheet,'Scraped Data');

       xlsx.writeFile(workbook,"scrapedData.xlsx");

    }
    catch(error){
        console.log(error);
    }
}


function writeData(fileName,dataInput){
    try {
        let jsonFile = JSON.stringify(dataInput)
        fs.writeFileSync(fileName, jsonFile)

    } catch (error) {
        console.log(error);
    }
}


function readData(fileName){
    try {
        const fileContent = fs.readFileSync(fileName, 'utf8');

        const dataOutput = JSON.parse(fileContent);

        return dataOutput;
        
    } catch (error) {
        console.log(error);
    }
}

dataScraping();