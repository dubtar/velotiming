namespace VeloTiming.Data {
    public class Entry {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int YearOfBirth { get; set; }
        public string Team { get; set; }
        public string City { get; set; }
        public virtual Category Category { get; set; }
        public string Number { get; set; }
        public Sex Sex { get; set; }
    }

    public enum Sex { Male, Female }
}    