/*
 *  Conway's game of life
 *  Rules and explanation: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
 *  Author: Dragutin Mitrecic dmitrecic@gmail.com, February 12th 2019.
 *  
 *  I got this task as a test task at one company where I was applying for a job position
 *  I created 2 versions of implementation of this game in pure JavaScript, 
 *  this is second one where I use two two-dimensional arrays as containers of the cells states.
 * 
 *  First one (currentGen) holds the data about current generation of living & dead cells.
 * 
 *  Second one (nextGen) is used to store new states of the cells from the current generation, 
 *  respective to the rules of the game.
 *  
 *  When rules are applied, nextGen grid is copied to the currentGen array, 
 *  nextGen array data are set to zero (erased) and the proccess starts again.
 *  
 */

var width=200;              // grid width
var height=200;             // grid height
var ticks=200;             // ticks (cycles)
var delay=150;               // delay between ticks (cycles)
var populationPercent=25;   // percentage of first population

var startingPopulation=calculatePopulationFromPercent(width*height,populationPercent);
var grid=document.getElementById("grid");

var currentGen=[];          // initialize current generation array grid
var nextGen=[];             // initialize next generation array grid

var n=0;                    // initialize variable for counting first population

/***********************************
 *                                 *
 *  LET'S START THE GAME OF LIFE   *
 *                                 *
************************************/

initializeWorld();          // create world for new life
createFirstPopulation();    // create first population
updateView();               // display first population at the screen
tickingLife(ticks,delay);   // start the game of life



/******************************************
 *  BELOW IS THE LOGIC PART OF THE GAME   *
*******************************************/

function initializeWorld()
{
    // Initialize "world" for new life 
    // create grid and arrays for current and next generation

    for(row=0;row<height;row++)
    {
        currentGen[row]=[];
        nextGen[row]=[];
        
        for(col=0;col<width;col++)
        {

            var cell=document.createElement("div");
            cell.setAttribute("id",cellId(row,col));
            
            grid.appendChild(cell);
            currentGen[row][col]=0;
            nextGen[row][col]=0;
        }
    }
}
function createFirstPopulation()
{
    // create first (starting) population
    while(n<startingPopulation)
    {
        posRow=randomPos(height);   // random position in the grids height
        posCol=randomPos(width);    // random position in the grids width

        if (currentGen[posRow][posCol]==0){
            currentGen[posRow][posCol]=1;
            n++;    
        }
    }
}

function tickingLife(ticks, delay){
    
    // loop over the ticks of life
    // with delay

    if (ticks){
        checkPopulation();
        setTimeout(
            () => { tickingLife(ticks - 1, delay); //recursive call
            },delay);
    }
}

function calculatePopulationFromPercent(total, percent)
{
    // calculate first population 
    return (total/100)*percent;
}

function randomPos(max)
{
    // return random number
    return Math.floor(Math.random()*max);
}

function cellId(row,col)
{
    // return cell id 
    return "f-"+row+"-"+col;
}

function updateView()
{
    // update the view in the grid on the screen
    for (row=0;row<height;row++)
    {
        for (col=0;col<width;col++)
        {
            if (currentGen[row][col]==1)
            {
                // if the cell is living, add the class to show it
                document.getElementById(cellId(row,col)).classList.add("alive");

            } else {
                // if the cell is dead, remove the class from the cell (act as dead)
                document.getElementById(cellId(row,col)).classList.remove("alive");

            }         
        }
    }
}

function applyRules(row,col,totalNeighboors)
{
    // if this cell is dead and neighboors number is 
    // equal to 3, then let it live in the next generation

    if (totalNeighboors==3 && currentGen[row][col]==0)
    {
        nextGen[row][col]=1;
    }
    
    // if current cell is live, apply the rules
    // regarding to the number of it's neighboors
    // to the next generation

    if (currentGen[row][col] == 1) {

        if (totalNeighboors<2 || totalNeighboors>3)
        {
            nextGen[row][col]=0;
        } else {
            nextGen[row][col]=1;
        }
    }
}

function copyGrid()
{
    // copy data from next generation grid
    // to current generation array grid
    // and erase data from nextGen array 
    // to prepare for next generation
    // (not neccessary, but I like it to be clean for the next cycle)

    for (var row=0; row<height; row++) 
    { 
        for (var col=0; col<width; col++) 
        {
            currentGen[row][col] = nextGen[row][col];
            nextGen[row][col]=0;
        }
    }
}

function lookAround(row,col)
{
    // look for the living cells around this cell
    // and count if there is any

    totalNeighboors=0;

    totalNeighboors+=currentGen[row-1][col];    // look up
    totalNeighboors+=currentGen[row+1][col];    // look down
    totalNeighboors+=currentGen[row][col-1];    // look left
    totalNeighboors+=currentGen[row][col+1];    // look right
    totalNeighboors+=currentGen[row-1][col-1];  // look up left
    totalNeighboors+=currentGen[row-1][col+1];  // look up right
    totalNeighboors+=currentGen[row+1][col-1];  // look down left
    totalNeighboors+=currentGen[row+1][col+1];  // look down right

    return totalNeighboors;
}


function checkPopulation()
{
    // check the state of the cell regarding to
    // it's neighboors and store the new cell state
    // into the nextGen data grid

    for (row=1;row<height-1;row++)
    {
        for (col=1;col<width-1;col++)
        {
            totalNeighboors = lookAround(row,col);

            // apply rules
            applyRules(row,col,totalNeighboors);
        }
            
    }

    // copy the nextGen grid to the currentGen grid
    copyGrid();

    // update the view at the screen
    updateView();
}