export const MENU_CATEGORIES = [
  {
    label: 'Study Destination',
    value: 'study_destination' as const,
    type:"destination",
     destinations: [
      {
        countryName: "Australia",
        options: {
          name:"University in Australia"
        }
      },
       {
        countryName: "New Zealand",
        options: {
          name:"University in Zealand"
        }
      },
      {
        countryName: "Canada",
        options: {
          name:"University in Canada"
        }
      }
    ]
   
  },
  {
    label: 'Find Course',
    value: 'find_course' as const,
    type:"course",
    studyLevel: [
      {
        name: 'Undergraduate courses',
        value:"undergradute"
        
      },
      {
        name: 'Postgraduate courses',
        value:"Postgradute"
      },
        
      {
        name: 'MBA courses',
        value:"mba"
        
      },
    ],
    popularSubject:[
      {
        name:"Computer Science and IT"
      },
      {
        name:"Architecture"
      },
       {
        name:"Business and Management"
      },
      

    ]
    
  },
  {
    label: 'Our Blogs',
    value: 'study_destination' as const,
    href:"/blog"
   
   
  },
  {
    label: 'Our Service',
    value: 'find_course' as const,
    
  },
]
