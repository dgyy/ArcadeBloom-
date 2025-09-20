import zipfile
import os

def create_zip(files, output_zip):
    # Create a zip file
    with zipfile.ZipFile(output_zip, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zipf: # Use ZIP_DEFLATED for compression as it did better in my tests
        for file in files:
            # Write the file to the zip archive without the directory structure
            arcname = os.path.basename(file)  # Add only the filename to the zip
            zipf.write(file, arcname=arcname)

# List of files you want to compress
files_to_compress = ['./dist/index.html']  # Example list of files
output_zip = './dist/compressed_files.zip'

# Create the zip file with ZIP_DEFLATED compression and no subfolder structure
create_zip(files_to_compress, output_zip)

print(f"Created {output_zip} with ZIP_DEFLATED compression and no subfolder.")
