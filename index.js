require("dotenv");
const Discogs = require("./dist").default; // needs changing, but what too?
// console.log("Bollocks, This Works, I'm A Software Engineer!");

const main = async () => {
  const discogs = new Discogs({});

  //USER INFORMATION
  const user = await discogs.getUser();
  const collection = await discogs.getUserCollection("1", "artist", "desc");
  const wantlist = await discogs.getUserWantlist();
  const folders = await discogs.getUserFolders();
  const folderContents = await discogs.getUserFolderContents("3784660", "2");
  const collectionValue = await discogs.getUserCollectionValue();

  // RELEASE INFORMATION

  const releaseDetails = await discogs.getRelease("249504"); //RICK-ROLL
  const releaseUserRating = await discogs.getReleaseUserRating("249504");
  const releaseCommunityRating = await discogs.getReleaseCommunityRating(
    "8749543"
  );
  const releaseStats = await discogs.getReleaseStats("249504");
  const releaseMaster = await discogs.getMasterRelease("96559");
  const releaseMasterVersions = await discogs.getMasterReleaseVersions("96559");

  // ARTIST INFORMATION

  const artistDetails = await discogs.getArtistDetails("72872"); //RICK ASTLEY
  const artistReleases = await discogs.getArtistReleases("72872");

  // LABEL INFORMATION

  const labelDetails = await discogs.getLabelDetails("895"); //RCA
  const labelReleases = await discogs.getLabelReleases("895");

  // DISPLAY SHIT ON SCREEN TO TEST

  // console.log(user.data);
  // console.log(folders.data);
  // console.log(collection.data);
  // console.log(wantlist.data);
  // console.log(folderContents.data);
  //   console.log(collectionValue.data);
  //   console.log(releaseDetails.data);
  //   console.log(releaseDetails.data);
  //   console.log(releaseUserRating.data);
  //   console.log(releaseCommunityRating.data);
  //   console.log(releaseStats.data);
  //   console.log(releaseMaster.data);
  //   console.log(releaseMasterVersions.data);
  //   console.log(artistDetails.data);
  //   console.log(artistReleases.data);
  //   console.log(labelDetails.data);
  //   console.log(labelReleases.data);
  console.log(discogs.getRatelimit());
};

main();
