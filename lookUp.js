import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  ListView,
  Keyboard,
  Switch,
} from 'react-native';

var Mailer = require('NativeModules').RNMail;
  
//import {RNMail} from './RNMail';

export default class LookUp extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      searchText: '', 
      dataSource: ds.cloneWithRows([]), 
      results: [],
      filteredResults: [],
      ds: ds,
      dictionaries: this.props.dictionaries,
    };
    this.pressSearch = this.pressSearch.bind(this);
    this.pressSelectDictionaries = this.pressSelectDictionaries.bind(this);
    this.updateDictionaries = this.updateDictionaries.bind(this);
    this.filterResults = this.filterResults.bind(this);
    this.pressMail = this.pressMail.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableHighlight style={styles.topButton} onPress={this.pressSelectDictionaries}>
            <Text style={styles.topButtonText}>Select Dictionaries</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.topButton} onPress={this.pressMail}>
            <Text style={styles.topButtonText}>Mail</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Type here to lookup!"
            onChangeText={(search) => this.setState({searchText: search})}
            returnKeyType='done'
            onSubmitEditing={this.pressSearch}
          />
          <TouchableHighlight style={styles.searchButton} onPress={this.pressSearch}>
            <Text style={styles.searchButtonText}>Search!</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.resultContainer}>
          <ListView
            enableEmptySections={true}
            style={styles.resultList}
            dataSource={this.state.dataSource}
            renderRow={(data) => 
              <View>
                <Text>{data.definition}</Text>
                <Text style={{fontStyle: 'italic'}}>{data.dictionary.name}</Text>
              </View>
            }   
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />} 
            renderFooter={() => <View style={{height: 20}}/>}
          />
        </View>
      </View>
    );
  }
  
  componentDidMount(){
    if(this.state.dictionaries.length == 0){
      this.getInitialDictionaries();
      console.log("initial load");
    }
  }

  async getInitialDictionaries(){
    try {
      //let response = await fetch('http://services.aonaware.com/DictService/DictService.asmx/DictionaryList');
      let response = [
        {
          "Id": "devils",
          "Name": "THE DEVIL'S DICTIONARY ((C)1911 Released April 15 1993)"
        },
        {
          "Id": "easton",
          "Name": "Easton's 1897 Bible Dictionary"
        },
        {
          "Id": "elements",
          "Name": "Elements database 20001107"
        },
        {
          "Id": "foldoc",
          "Name": "The Free On-line Dictionary of Computing (27 SEP 03)"
        },
        {
          "Id": "gazetteer",
          "Name": "U.S. Gazetteer (1990)"
        },
        {
          "Id": "gcide",
          "Name": "The Collaborative International Dictionary of English v.0.44"
        },
        {
          "Id": "hitchcock",
          "Name": "Hitchcock's Bible Names Dictionary (late 1800's)"
        },
        {
          "Id": "jargon",
          "Name": "Jargon File (4.3.1, 29 Jun 2001)"
        },
        {
          "Id": "vera",
          "Name": "Virtual Entity of Relevant Acronyms (Version 1.9, June 2002)"
        },
        {
          "Id": "wn",
          "Name": "WordNet (r) 2.0"
        },
        {
          "Id": "world02",
          "Name": "CIA World Factbook 2002"
        }
      ];
      for(var i = 0; i < response.length; i++){
        response[i].selected = true;
      }
      this.setState({dictionaries: response});
    } catch(error) {
      console.error(error);
    }
  }
  
  pressSelectDictionaries(){
    this.props.navigator.push({
      name: 'SelectDictionaries',
      passProps: {
        updateDictionaries: this.updateDictionaries,
        dictionaries: this.state.dictionaries
      }
    })
  }

  updateDictionaries(dictionaries){
    var filteredResults = this.filterResults(this.state.results, dictionaries);
    this.setState({dictionaries: dictionaries, filteredResults: filteredResults, dataSource: this.state.ds.cloneWithRows(filteredResults)});
    
  }

  async pressSearch(){
    try {
      //let response = await fetch('http://services.aonaware.com/DictService/DictService.asmx/Define?word=' + this.state.searchText);
      //Om aan te tonen dat ik netwerk interactie kan doen (niet zo heel moeilijk in react native).
      //Aangezien XML deftig parsen naar JSON een hel is en ik er uren in heb gestoken ga ik gewoon verder met een dummy object werken, de zoekresultaten zullen dus altijd dezelfde zijn
      let responseJson = [
        {
          definition: 'Book This word has a comprehensive meaning in Scripture. In the Old Testament it is the rendering of the Hebrew word _sepher_, which properly means a "writing," and then a "volume" (Ex. 17:14; Deut. 28:58; 29:20; Job 19:23) or "roll of a book" (Jer. 36:2, 4). Books were originally written on skins, on linen or cotton cloth, and on Egyptian papyrus, whence our word "paper." The leaves of the book were generally written in columns, designated by a Hebrew word properly meaning "doors" and "valves" (Jer. 36:23, R.V., marg. "columns"). Among the Hebrews books were generally rolled up like our maps, or if very long they were rolled from both ends, forming two rolls (Luke 4:17-20). Thus they were arranged when the writing was on flexible materials; but if the writing was on tablets of wood or brass or lead, then the several tablets were bound together by rings through which a rod was passed. A sealed book is one whose contents are secret (Isa. 29:11; Rev. 5:1-3). To "eat" a book (Jer. 15:16; Ezek. 2:8-10; 3:1-3; Rev. 10:9) is to study its contents carefully. The book of judgment (Dan. 7:10) refers to the method of human courts of justice as illustrating the proceedings which will take place at the day of God\'s final judgment. The book of the wars of the Lord (Num. 21:14), the book of Jasher (Josh. 10:13), and the book of the chronicles of the kings of Judah and Israel (2 Chr. 25:26), were probably ancient documents known to the Hebrews, but not forming a part of the canon. The book of life (Ps. 69:28) suggests the idea that as the redeemed form a community or citizenship (Phil. 3:20; 4:3), a catalogue of the citizens\' names is preserved (Luke 10:20; Rev. 20:15). Their names are registered in heaven (Luke 10:20; Rev. 3:5). The book of the covenant (Ex. 24:7), containing Ex. 20:22-23:33, is the first book actually mentioned as a part of the written word. It contains a series of laws, civil, social, and religious, given to Moses at Sinai immediately after the delivery of the decalogue. These were written in this "book."',
          dictionary: {
            name: 'Easton\'s 1897 Bible Dictionary',
            Id: 'easton'
          }
        },
        {
          definition: 'Rhapsody \Rhap"so*dy\, n.; pl. {Rhapsodies}. [F. rhapsodie, L. rhapsodia, Gr. "rapsw,di`a, fr. "rapsw,do`s a rhapsodist; "ra`ptein to sew, stitch together, unite + \'w,dh` a song. See {Ode}.] 1. A recitation or song of a rhapsodist; a portion of an epic poem adapted for recitation, or usually recited, at one time; hence, a division of the Iliad or the Odyssey; -- called also a {book}. [1913 Webster] 2. A disconnected series of sentences or statements composed under excitement, and without dependence or natural connection; rambling composition. ``A rhapsody of words.\'\' --Shak. ``A rhapsody of tales.\'\' --Locke. [1913 Webster] 3. (Mus.) A composition irregular in form, like an improvisation; as, Liszt\'s ``Hungarian Rhapsodies.\'\' [1913 Webster]',
          dictionary: {
            name: 'The Collaborative International Dictionary of English v.0.44',
            Id: 'gcide'
          }
        },
        {
          definition: 'Bell \\Bell\\, n. [AS. belle, fr. bellan to bellow. See {Bellow}.] 1. A hollow metallic vessel, usually shaped somewhat like a cup with a flaring mouth, containing a clapper or tongue, and giving forth a ringing sound on being struck. [1913 Webster] Note: Bells have been made of various metals, but the best have always been, as now, of an alloy of copper and tin. [1913 Webster] {The Liberty Bell}, the famous bell of the Philadelphia State House, which rang when the Continental Congress declared the Independence of the United States, in 1776. It had been cast in 1753, and upon it were the words ``Proclaim liberty throughout all the land, to all the inhabitants thereof.\'\' [1913 Webster] 2. A hollow perforated sphere of metal containing a loose ball which causes it to sound when moved. [1913 Webster] 3. Anything in the form of a bell, as the cup or corol of a flower. ``In a cowslip\'s bell I lie.\'\' --Shak. [1913 Webster] 4. (Arch.) That part of the capital of a column included between the abacus and neck molding; also used for the naked core of nearly cylindrical shape, assumed to exist within the leafage of a capital. [1913 Webster] 5. pl. (Naut.) The strikes of the bell which mark the time; or the time so designated. [1913 Webster] Note: On shipboard, time is marked by a bell, which is struck eight times at 4, 8, and 12 o\'clock. Half an hour after it has struck ``eight bells\'\' it is struck once, and at every succeeding half hour the number of strokes is increased by one, till at the end of the four hours, which constitute a watch, it is struck eight times. [1913 Webster] {To bear away the bell}, to win the prize at a race where the prize was a bell; hence, to be superior in something. --Fuller. {To bear the bell}, to be the first or leader; -- in allusion to the bellwether or a flock, or the leading animal of a team or drove, when wearing a bell. {To curse by bell}, {book}, {and candle}, a solemn form of excommunication used in the Roman Catholic church, the bell being tolled, the book of offices for the purpose being used, and three candles being extinguished with certain ceremonies. --Nares. {To lose the bell}, to be worsted in a contest. ``In single fight he lost the bell.\'\' --Fairfax. {To shake the bells}, to move, give notice, or alarm. --Shak. [1913 Webster] Note: Bell is much used adjectively or in combinations; as, bell clapper; bell foundry; bell hanger; bell-mouthed; bell tower, etc., which, for the most part, are self-explaining. [1913 Webster] {Bell arch} (Arch.), an arch of unusual form, following the curve of an ogee. {Bell cage}, or {Bell carriage} (Arch.), a timber frame constructed to carry one or more large bells. {Bell cot} (Arch.), a small or subsidiary construction, frequently corbeled out from the walls of a structure, and used to contain and support one or more bells. {Bell deck} (Arch.), the floor of a belfry made to serve as a roof to the rooms below. {Bell founder}, one whose occupation it is to found or cast bells. {Bell foundry}, or {Bell foundery}, a place where bells are founded or cast. {Bell gable} (Arch.), a small gable-shaped construction, pierced with one or more openings, and used to contain bells. {Bell glass}. See {Bell jar}. {Bell hanger}, a man who hangs or puts up bells. {Bell pull}, a cord, handle, or knob, connecting with a bell or bell wire, and which will ring the bell when pulled. --Aytoun. {Bell punch}, a kind of conductor\'s punch which rings a bell when used. {Bell ringer}, one who rings a bell or bells, esp. one whose business it is to ring a church bell or chime, or a set of musical bells for public entertainment. {Bell roof} (Arch.), a roof shaped according to the general lines of a bell. {Bell rope}, a rope by which a church or other bell is rung. {Bell tent}, a circular conical-topped tent. {Bell trap}, a kind of bell shaped stench trap. [1913 Webster]',
          dictionary: {
            name: 'The Collaborative International Dictionary of English v.0.44',
            Id: 'gcide'
          }
        },
        {
          definition: 'Book \\Book\\ (b[oo^]k), n. [OE. book, bok, AS. b[=o]c; akin to Goth. b[=o]ka a letter, in pl. book, writing, Icel. b[=o]k, Sw. bok, Dan. bog, OS. b[=o]k, D. boek, OHG. puoh, G. buch; and fr. AS. b[=o]c, b[=e]ce, beech; because the ancient Saxons and Germans in general wrote runes on pieces of beechen board. Cf. {Beech}.] 1. A collection of sheets of paper, or similar material, blank, written, or printed, bound together; commonly, many folded and bound sheets containing continuous printing or writing. [1913 Webster] Note: When blank, it is called a blank book. When printed, the term often distinguishes a bound volume, or a volume of some size, from a pamphlet. [1913 Webster] Note: It has been held that, under the copyright law, a book is not necessarily a volume made of many sheets bound together; it may be printed on a single sheet, as music or a diagram of patterns. --Abbott. [1913 Webster] 2. A composition, written or printed; a treatise. [1913 Webster] A good book is the precious life blood of a master spirit, embalmed and treasured up on purpose to a life beyond life. --Milton. [1913 Webster] 3. A part or subdivision of a treatise or literary work; as, the tenth book of ``Paradise Lost.\'\' [1913 Webster] 4. A volume or collection of sheets in which accounts are kept; a register of debts and credits, receipts and expenditures, etc.; -- often used in the plural; as, they got a subpoena to examine our books. Syn: ledger, leger, account book, book of account. [1913 Webster + WordNet 1.5] 5. Six tricks taken by one side, in the game of bridge or whist, being the minimum number of tricks that must be taken before any additional tricks are counted as part of the score for that hand; in certain other games, two or more corresponding cards, forming a set. [1913 Webster +PJC] 6. (Drama) a written version of a play or other dramatic composition; -- used in preparing for a performance. Syn: script, playscript. [WordNet 1.5] 7. a set of paper objects (tickets, stamps, matches, checks etc.) bound together by one edge, like a book; as, he bought a book of stamps. [WordNet 1.5] 8. a book or list, actual or hypothetical, containing records of the best performances in some endeavor; a recordbook; -- used in the phrase {one for the book} or {one for the books}. Syn: record, recordbook. [PJC] 9. (Sport) the set of facts about an athlete\'s performance, such as typical performance or playing habits or methods, that are accumulated by potential opponents as an aid in deciding how best to compete against that athlete; as, the book on Ted Williams suggests pitching to him low and outside. [PJC] 10. (Finance) same as {book value}. [PJC] 11. (Stock market) the list of current buy and sell orders maintained by a stock market specialist. [PJC] 12. (Commerce) the purchase orders still outstanding and unfilled on a company\'s ledger; as, book to bill ratio. [PJC] Note: Book is used adjectively or as a part of many compounds; as, book buyer, bookrack, book club, book lore, book sale, book trade, memorandum book, cashbook. [1913 Webster] {Book account}, an account or register of debt or credit in a book. {Book debt}, a debt for items charged to the debtor by the creditor in his book of accounts. {Book learning}, learning acquired from books, as distinguished from practical knowledge. ``Neither does it so much require book learning and scholarship, as good natural sense, to distinguish true and false.\'\' --Burnet. {Book louse} (Zo["o]l.), one of several species of minute, wingless insects injurious to books and papers. They belong to the {Pseudoneuroptera}. {Book moth} (Zo["o]l.), the name of several species of moths, the larv[ae] of which eat books. {Book oath}, an oath made on {The Book}, or Bible. {The Book of Books}, the Bible. {Book post}, a system under which books, bulky manuscripts, etc., may be transmitted by mail. {Book scorpion} (Zo["o]l.), one of the false scorpions ({Chelifer cancroides}) found among books and papers. It can run sidewise and backward, and feeds on small insects. {Book stall}, a stand or stall, often in the open air, for retailing books. {Canonical books}. See {Canonical}. {In one\'s books}, in one\'s favor. ``I was so much in his books, that at his decease he left me his lamp.\'\' --Addison. {To bring to book}. (a) To compel to give an account. (b) To compare with an admitted authority. ``To bring it manifestly to book is impossible.\'\' --M. Arnold. {by the book}, according to standard procedures; using the correct or usual methods. {cook the books}, make fallacious entries in or otherwise manipulate a financial record book for fraudulent purposes. {To curse by bell, book, and candle}. See under {Bell}. {To make book} (Horse Racing), to conduct a business of accepting or placing bets from others on horse races. {To make a book} (Horse Racing), to lay bets (recorded in a pocket book) against the success of every horse, so that the bookmaker wins on all the unsuccessful horses and loses only on the winning horse or horses. {off the books}, not recorded in the official financial records of a business; -- usually used of payments made in cash to fraudulently avoid payment of taxes or of employment benefits. {one for the book}, {one for the books}, something extraordinary, such as a record-breaking performance or a remarkable accomplishment. {To speak by the book}, to speak with minute exactness. {to throw the book at}, to impose the maximum fine or penalty for an offense; -- usually used of judges imposing penalties for criminal acts. {Without book}. (a) By memory. (b) Without authority. {to write the book}, to be the leading authority in a field; -- usually used in the past tense; as, he\'s not just an average expert, he wrote the book. [1913 Webster +PJC]',
          dictionary: {
            name: 'The Collaborative International Dictionary of English v.0.44',
            Id: 'gcide'
          }
        },
        {
          definition: 'Book \\Book\\, v. t. [imp. & p. p. {Booked} (b[oo^]kt); p. pr. & vb. n. {Booking}.] 1. To enter, write, or register in a book or list. [1913 Webster] Let it be booked with the rest of this day\'s deeds. --Shak. [1913 Webster] 2. To enter the name of (any one) in a book for the purpose of securing a passage, conveyance, or seat; to reserve[2]; also, to make an arrangement for a reservation; as, to be booked for Southampton; to book a seat in a theater; to book a reservation at a restaurant. [1913 Webster +PJC] 3. To mark out for; to destine or assign for; as, he is booked for the valedictory. [Colloq.] [1913 Webster] Here I am booked for three days more in Paris. --Charles Reade. [1913 Webster] 4. to make an official record of a charge against (a suspect in a crime); -- performed by police. [PJC]',
          dictionary: {
            name: 'The Collaborative International Dictionary of English v.0.44',
            Id: 'gcide'
          }
        },
        {
          definition: 'book n 1: a written work or composition that has been published (printed on pages bound together); "I am reading a good book on economics" 2: physical objects consisting of a number of pages bound together; "he used a large book as a doorstop" [syn: {volume}] 3: a record in which commercial accounts are recorded; "they got a subpoena to examine our books" [syn: {ledger}, {leger}, {account book}, {book of account}] 4: a number of sheets (ticket or stamps etc.) bound together on one edge; "he bought a book of stamps" 5: a compilation of the known facts regarding something or someone; "Al Smith used to say, `Let\'s look at the record\'"; "his name is in all the recordbooks" [syn: {record}, {record book}] 6: a major division of a long written composition; "the book of Isaiah" 7: a written version of a play or other dramatic composition; used in preparing for a performance [syn: {script}, {playscript}] 8: a collection of rules or prescribed standards on the basis of which decisions are made; "they run things by the book around here" [syn: {rule book}] 9: the sacred writings of Islam revealed by God to the prophet Muhammad during his life at Mecca and Medina [syn: {Koran}, {Quran}, {al-Qur\'an}] 10: the sacred writings of the Christian religions; "he went to carry the Word to the heathen" [syn: {Bible}, {Christian Bible}, {Good Book}, {Holy Scripture}, {Holy Writ}, {Scripture}, {Word of God}, {Word}] v 1: record a charge in a police register; "The policeman booked her when she tried to solicit a man" 2: arrange for and reserve (something for someone else) in advance; "reserve me a seat on a flight"; "The agent booked tickets to the show for the whole family"; "please hold a table at Maxim\'s" [syn: {reserve}, {hold}] 3: engage for a performance; "Her agent had booked her for several concerts in Tokyo" 4: register in a hotel booker',
          dictionary: {
            name: 'WordNet (r) 2.0',
            Id: 'wn'
          }
        }
      ];
      var filteredResults = this.filterResults(responseJson, this.state.dictionaries);
      this.setState({results: responseJson, filteredResults: filteredResults, dataSource: this.state.ds.cloneWithRows(filteredResults)});
    } catch(error) {
      console.error(error);
    }
    Keyboard.dismiss();
  }

  filterResults(results, dictionaries){
    var allowedId = [];
    for(var i = 0; i < dictionaries.length; i++){
      var dictionary = dictionaries[i];
      if(dictionary.selected){
        allowedId.push(dictionary.Id);
      }
    }
    var filteredResults = []
    for (var j = 0; j < results.length; j++){
      var result = results[j];
      if(allowedId.includes(result.dictionary.Id)){
        filteredResults.push(result);
      }
    }
    return filteredResults;
  }

  pressMail(){
    var body = 'I found some cool definitions for the word ' + this.state.searchText+'\n\n';
    for(var i = 0; i < this.state.filteredResults.length; i++){
      var result = this.state.filteredResults[i];
      body += 'from ' + result.dictionary.name + '\n' + 'Definition: ' + result.definition + '\n\n';
    }
    
    Mailer.mail({
      subject: 'cool definitions for the word ' + this.state.searchText,
      body: body,
    }, (error, event) => {
      if(error) {
        AlertIOS.alert('Error', 'Could not send mail. Please send a mail to support@example.com');
      }
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  topBar: {
    height: 50,
    flexDirection: 'row', 
  },
  
  topButton: {
    padding: 5,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#DDD',
    borderWidth: 1,
  },

  topButtonText: {
    color: '#000', 
    textAlign: 'center',
    fontSize: 15,
    flex: 1,
  },

  searchContainer: {
    height: 60,
    flexDirection: 'row',
    marginBottom: 10,
  },

  searchInput: {
    flex: 1,
  },

  searchButton: {
    padding: 5,
    width: 70,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#0F0',
  },

  searchButtonText: {
    color: '#000', 
    textAlign: 'center',
    fontSize: 15,
    flex: 1,
  },

  resultContainer: {
    flex: 1,
  },

  resultList: {
    flex: 1,
    padding: 10
  },

  separator: {
    flex: 1,
    height: 2,
    backgroundColor: '#8E8E8E',
  },

});
