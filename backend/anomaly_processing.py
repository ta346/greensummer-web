import ee
from gee_script.landsat_functions import get_landsat_collection, make_composite
from gee_script.mask import image_mask

def anomaly_processing(
        selected_province: str,
        selected_soum: str,
        selected_vegetation_index: str,
        selected_year: str,
        grazing_only: bool
):  
    selected_province = str(selected_province)
    selected_soum = str(selected_soum)
    selected_vegetation_index = str(selected_vegetation_index)
    selected_year = int(selected_year)
    
    # laod province soum features from GEE
    fc = ee.FeatureCollection('users/ta346/mng-bounds/soum_aimag')
    
    # subset province and soum given user inputs
    soum_aimag = fc.filter(ee.Filter.And(ee.Filter.eq("aimag_eng", selected_province), ee.Filter.eq("soum_eng", selected_soum)))
    geom = soum_aimag.geometry()

    
    # cloud free landsat collection
    landsat_collection = (get_landsat_collection(dateIni='2017-01-01', # initial date
                                                            dateEnd='2023-12-31', # end date
                                                            box=geom, # area of interest
                                                            cloud_cover_perc = 20,
                                                            sensor=["LC08", "LE07", "LT05"], # LC08, LE07, LT05, search for all available sensors
                                                            harmonization=True)) # ETM and ETM+ to OLI
    
    # Compute vegetation indices on cloud free landsat collection for only summer
    if selected_vegetation_index == 'NDVI':
        summer_composite = (make_composite(landsat_collection, 6, 8, geom)).select('ndvi')
    elif selected_vegetation_index == 'EVI':
      summer_composite = (make_composite(landsat_collection, 6, 8, geom)).select('evi')
    elif selected_vegetation_index == 'MSAVI':
      summer_composite = (make_composite(landsat_collection, 6, 8, geom)).select('msavi')
    
    if grazing_only:
        summer_pasture_mask = ee.Image("users/ta346/pasture_delineation/pas_raster_new")
        
        summer_composite = summer_composite.map(image_mask(summer_pasture_mask, [3]))
    
    # Define dates to filter given user input
    dateIni = ee.Date.fromYMD(selected_year, 1, 1)
    dateEnd = ee.Date.fromYMD(selected_year, 12, 31)
    
    # Anomaly year
    selected_image = summer_composite.filterDate(dateIni, dateEnd).first()
    
    # Take mean of entire summer composite
    yMean = summer_composite.mean()

    # Find the standard deviation
    stdImg = summer_composite.reduce(ee.Reducer.stdDev())
    
    # Find anomaly
    Anomaly = selected_image.subtract(yMean).divide(stdImg).clip(geom)
    
    # convert anomaly raster into JSON

    # For demonstration, we are returning the data as a dictionary
    return Anomaly.getInfo()
